import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertCircle, Lock, MapPinOff } from 'lucide-react';

const MainApp = lazy(() => import('./MainApp'));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const [password, setPassword] = useState('');
  const [errorIndex, setErrorIndex] = useState(0);

  // Persisted state
  const [attempts, setAttempts] = useState(() => {
    return parseInt(localStorage.getItem('loginAttempts') || '0', 10);
  });

  const [lockoutTime, setLockoutTime] = useState(() => {
    const lockoutUntil = localStorage.getItem('lockoutUntil');
    if (lockoutUntil) {
      const remainingTime = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000);
      return remainingTime > 0 ? remainingTime : 0;
    }
    return 0;
  });

  const [isChecking, setIsChecking] = useState(false);

  // Geolocation and IP state
  const [isLocationChecking, setIsLocationChecking] = useState(true);
  const [isAllowedLocation, setIsAllowedLocation] = useState(false);
  const [userIp, setUserIp] = useState('');

  // IP Blocklist check from localStorage 
  const [isIpBlocked, setIsIpBlocked] = useState(false);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        setUserIp(data.ip);

        // Persistent IP block check
        const blockedIps = JSON.parse(localStorage.getItem('blockedIps') || '[]');
        if (blockedIps.includes(data.ip)) {
          setIsIpBlocked(true);
        }

        // Only allow connections from Chile (country_code: 'CL')
        if (data.country_code === 'CL') {
          setIsAllowedLocation(true);
        }
      } catch (error) {
        console.error("Error checking location:", error);
        // By default, if we can't verify, we'll allow but they still need the password.
        // Assuming user wants strictness, we could block it, but let's be safe.
      } finally {
        setIsLocationChecking(false);
      }
    };

    if (!isAuthenticated) {
      checkLocation();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let timer: number;
    if (lockoutTime > 0) {
      timer = window.setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            localStorage.removeItem('lockoutUntil');
            setAttempts(0);
            localStorage.setItem('loginAttempts', '0');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0 || isChecking || !password.trim() || !isAllowedLocation || isIpBlocked) return;

    setIsChecking(true);

    try {
      let hashHex = '';
      if (crypto && crypto.subtle) {
        const msgUint8 = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      } else {
        // Fallback for local network access (HTTP instead of HTTPS)
        // crypto.subtle is undefined in insecure contexts.
        hashHex = password === '0536' ? 'a952de18bfa1e4213e709392daf76ad9fa9887fc3853730ac6c7f1758445cd5d' : 'invalid';
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting

      if (hashHex === 'a952de18bfa1e4213e709392daf76ad9fa9887fc3853730ac6c7f1758445cd5d') {
        sessionStorage.setItem('isAuthenticated', 'true');
        setAttempts(0);
        localStorage.setItem('loginAttempts', '0');
        setIsAuthenticated(true);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());
        setErrorIndex(prev => prev + 1);
        setPassword('');

        // Block IP permanently after 10 failed attempts, or 30s timeout after 5 attempts
        if (newAttempts >= 10) {
          setIsIpBlocked(true);
          const blockedIps = JSON.parse(localStorage.getItem('blockedIps') || '[]');
          if (userIp && !blockedIps.includes(userIp)) {
            blockedIps.push(userIp);
            localStorage.setItem('blockedIps', JSON.stringify(blockedIps));
          }
        } else if (newAttempts >= 5) {
          const timeoutSeconds = 60 * (newAttempts - 4); // Escalates timeout: 1m, 2m, 3m...
          setLockoutTime(timeoutSeconds);
          localStorage.setItem('lockoutUntil', (Date.now() + timeoutSeconds * 1000).toString());
        }
      }
    } finally {
      setIsChecking(false);
    }
  };

  const renderLogin = () => {
    if (isLocationChecking) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full p-6 space-y-8"
      >
        <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
          <ShieldCheck className="w-10 h-10 text-indigo-400" />
        </div>

        <div className="text-center space-y-3 w-full">
          <h1 className="text-3xl font-black tracking-tight text-white">Acceso Restringido</h1>
          <p className="text-zinc-400 text-sm">Ingresa tu código de seguridad para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={lockoutTime > 0 || isChecking}
              placeholder="Contraseña"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 text-center tracking-widest text-xl font-bold"
              maxLength={20}
              autoComplete="off"
              id="security-code"
            />
          </div>

          {errorIndex > 0 && lockoutTime === 0 && attempts < 5 && (
            <motion.div
              key={errorIndex}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-red-400 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20 justify-center"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">
                Código incorrecto. Intentos restantes: {5 - attempts}
              </span>
            </motion.div>
          )}

          {lockoutTime > 0 && (
            <div className="flex items-center space-x-2 text-orange-400 bg-orange-500/10 px-4 py-3 rounded-xl border border-orange-500/20 justify-center">
              <Lock className="w-5 h-5" />
              <span className="text-sm font-semibold text-center leading-tight">
                Demasiados intentos.<br />Espera {lockoutTime}s
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={lockoutTime > 0 || isChecking || !password.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center space-x-2"
          >
            {isChecking ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Desbloquear App</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    );
  };

  return (
    <div className="h-[100dvh] w-full max-w-[412px] mx-auto bg-zinc-950 text-white overflow-hidden font-sans selection:bg-indigo-500/30">
      {isAuthenticated ? (
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        }>
          <MainApp />
        </Suspense>
      ) : (
        <AnimatePresence mode="wait">
          {renderLogin()}
        </AnimatePresence>
      )}
    </div>
  );
}
