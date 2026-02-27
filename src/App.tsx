import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertCircle, Lock, Fingerprint } from 'lucide-react';

const MainApp = lazy(() => import('./MainApp'));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const [password, setPassword] = useState('');
  const [errorIndex, setErrorIndex] = useState(0);

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
  const [isLocationChecking, setIsLocationChecking] = useState(true);
  const [isAllowedLocation, setIsAllowedLocation] = useState(false);
  const [userIp, setUserIp] = useState('');
  const [isIpBlocked, setIsIpBlocked] = useState(false);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        setUserIp(data.ip);

        const blockedIps = JSON.parse(localStorage.getItem('blockedIps') || '[]');
        if (blockedIps.includes(data.ip)) {
          setIsIpBlocked(true);
        }

        if (data.country_code === 'CL') {
          setIsAllowedLocation(true);
        }
      } catch (error) {
        console.error("Error checking location:", error);
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
        hashHex = password === '0536' ? 'a952de18bfa1e4213e709392daf76ad9fa9887fc3853730ac6c7f1758445cd5d' : 'invalid';
      }

      await new Promise(resolve => setTimeout(resolve, 500));

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

        if (newAttempts >= 10) {
          setIsIpBlocked(true);
          const blockedIps = JSON.parse(localStorage.getItem('blockedIps') || '[]');
          if (userIp && !blockedIps.includes(userIp)) {
            blockedIps.push(userIp);
            localStorage.setItem('blockedIps', JSON.stringify(blockedIps));
          }
        } else if (newAttempts >= 5) {
          const timeoutSeconds = 60 * (newAttempts - 4);
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
          <div className="w-10 h-10 border-3 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full px-8 relative"
      >
        {/* Background decorations */}
        <div className="absolute top-[10%] left-[-20%] w-[60%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-20%] w-[50%] h-[40%] bg-amber-600/10 rounded-full blur-[100px] animate-glow-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center mb-8 glow-yellow animate-float relative"
        >
          <Fingerprint className="w-12 h-12 text-zinc-950" />
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/20 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-3 w-full mb-10"
        >
          <h1 className="text-4xl font-black tracking-tight text-white">Acceso Privado</h1>
          <p className="text-zinc-500 text-base font-medium">Ingresa tu código para continuar</p>
        </motion.div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          onSubmit={handleLogin}
          className="w-full space-y-5 max-w-sm"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 blur-xl opacity-50 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={lockoutTime > 0 || isChecking}
              placeholder="• • • •"
              className="w-full glass-card-strong rounded-2xl px-6 py-5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all disabled:opacity-40 text-center tracking-[0.5em] text-2xl font-black relative z-10"
              maxLength={20}
              autoComplete="off"
              id="security-code"
            />
          </div>

          <AnimatePresence>
            {errorIndex > 0 && lockoutTime === 0 && attempts < 5 && (
              <motion.div
                key={errorIndex}
                initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 text-red-400 glass-card rounded-2xl px-5 py-4 border-red-500/20 justify-center"
                style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-bold">
                  Código incorrecto. Intentos restantes: {5 - attempts}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {lockoutTime > 0 && (
            <div className="flex items-center gap-3 text-amber-400 glass-card rounded-2xl px-5 py-4 justify-center" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
              <Lock className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-bold text-center leading-tight">
                Demasiados intentos. Espera {lockoutTime}s
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={lockoutTime > 0 || isChecking || !password.trim()}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed text-zinc-950 font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg active:scale-[0.97] glow-yellow relative overflow-hidden group"
          >
            {isChecking ? (
              <div className="w-6 h-6 border-3 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Desbloquear</span>
              </>
            )}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
          </button>
        </motion.form>
      </motion.div>
    );
  };

  return (
    <div className="h-[100dvh] w-full bg-zinc-950 text-white overflow-hidden font-sans selection:bg-yellow-500/30">
      {isAuthenticated ? (
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-3 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin" />
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
