import { useState, useEffect, useRef } from 'react';
import { routines } from './data/routines';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronRight, CheckCircle, Timer, Dumbbell, Activity, Volume2 } from 'lucide-react';

type Screen = 'home' | 'countdown' | 'workout' | 'done';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');
  const [stepIndex, setStepIndex] = useState(0);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmIntervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const startAlarm = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    if (alarmIntervalRef.current) return;

    const playBeep = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    };

    playBeep();
    alarmIntervalRef.current = window.setInterval(playBeep, 500);
    setIsAlarmRinging(true);
  };

  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    setIsAlarmRinging(false);
  };

  const handleStartRoutine = (day: string) => {
    setSelectedDay(day);
    setScreen('countdown');
    setCountdown(30);
  };

  const advanceStep = () => {
    stopAlarm();
    if (timerRef.current) clearInterval(timerRef.current);

    const routine = routines[selectedDay];
    if (stepIndex + 1 < routine.length) {
      const nextStep = routine[stepIndex + 1];
      setStepIndex(stepIndex + 1);
      if (nextStep.type === 'rest') {
        setRestTimeLeft(nextStep.duration);
      }
    } else {
      setScreen('done');
    }
  };

  // Countdown effect
  useEffect(() => {
    if (screen === 'countdown') {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setScreen('workout');
            setStepIndex(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [screen]);

  // Rest timer effect
  useEffect(() => {
    if (screen === 'workout') {
      const routine = routines[selectedDay];
      const currentStep = routine[stepIndex];

      if (currentStep.type === 'rest' && restTimeLeft > 0 && !isAlarmRinging) {
        timerRef.current = window.setInterval(() => {
          setRestTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              startAlarm();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timerRef.current!);
      }
    }
  }, [screen, stepIndex, restTimeLeft, isAlarmRinging, selectedDay]);

  const renderHome = () => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full p-6 space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-white">Entrenamiento</h1>
        <p className="text-zinc-400">Selecciona tu rutina de hoy</p>
      </div>

      <div className="w-full space-y-4">
        {Object.keys(routines).map((day) => (
          <button
            key={day}
            onClick={() => handleStartRoutine(day)}
            className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                {day === 'Lunes' || day === 'Jueves' ? <Activity /> : <Dumbbell />}
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-white">{day}</h2>
                <p className="text-sm text-zinc-500">
                  {day === 'Lunes' || day === 'Jueves' ? 'Tren Superior' : day === 'Martes' ? 'Tren Inferior 1' : 'Tren Inferior 2'}
                </p>
              </div>
            </div>
            <Play className="text-zinc-600" />
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderCountdown = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full p-6"
    >
      <h2 className="text-3xl font-bold text-zinc-400 mb-8">Prepárate</h2>
      <div className="relative flex items-center justify-center w-64 h-64">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
          <circle
            cx="128" cy="128" r="120"
            stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - countdown / 30)}
            className="text-indigo-500 transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="text-7xl font-black text-white">{countdown}</span>
      </div>
      <button
        onClick={() => { setScreen('workout'); setStepIndex(0); }}
        className="mt-12 px-8 py-4 bg-white text-black rounded-full font-bold text-lg"
      >
        Saltar
      </button>
    </motion.div>
  );

  const renderWorkout = () => {
    const routine = routines[selectedDay];
    const step = routine[stepIndex];
    const progress = ((stepIndex + 1) / routine.length) * 100;

    let nextDifferentExercise = null;
    for (let i = stepIndex + 1; i < routine.length; i++) {
      const nextStep = routine[i];
      if (step.type === 'exercise' && nextStep.type === 'exercise' && nextStep.title !== step.title) {
        nextDifferentExercise = nextStep.title;
        break;
      }
    }

    return (
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
        className="flex flex-col h-full relative"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900 z-50">
          <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Right side tap area */}
        <div
          className="absolute top-0 right-0 w-[40%] h-full z-40 flex items-center justify-end pr-4 active:bg-white/5 transition-colors"
          onClick={advanceStep}
        >
          <div className="w-12 h-32 rounded-l-2xl flex items-center justify-center opacity-20">
            <ChevronRight className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-center relative z-30 pointer-events-none">
          {step.type === 'exercise' ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-indigo-400">
                  <span>{step.block}</span>
                  <span>{step.seriesInfo}</span>
                </div>
                <h2 className="text-4xl font-black text-white leading-tight">{step.title}</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                  <div className="text-zinc-500 text-sm mb-1 font-medium">Repeticiones</div>
                  <div className="text-3xl font-black text-white">{step.reps}</div>
                </div>
                {step.weight && (
                  <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <div className="text-zinc-500 text-sm mb-1 font-medium">Carga</div>
                    <div className="text-3xl font-black text-white">{step.weight}</div>
                  </div>
                )}
              </div>

              <div className="bg-indigo-500/10 rounded-2xl p-6 border border-indigo-500/20">
                <div className="text-indigo-300 text-sm mb-2 font-bold">Instrucciones</div>
                <p className="text-indigo-100 text-lg leading-relaxed">{step.notes}</p>
              </div>

              {step.muscles && step.muscles.length > 0 && (
                <div className="space-y-3">
                  <div className="text-zinc-500 text-sm font-medium">Músculos Involucrados</div>
                  <div className="flex flex-wrap gap-2">
                    {step.muscles.map((muscle, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-1.5 rounded-full text-sm font-bold border flex items-center space-x-2
                          ${muscle.type === 'primary'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                      >
                        <span>{muscle.name}</span>
                        <span className="opacity-60">{muscle.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {nextDifferentExercise && (
                <div className="text-center">
                  <span className="text-zinc-500 text-sm font-medium">Siguiente: {nextDifferentExercise}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <Timer className="w-16 h-16 text-zinc-500" />
              <h2 className="text-3xl font-bold text-zinc-400">Descanso</h2>
              <div className="text-8xl font-black text-white tabular-nums tracking-tighter">
                {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
              </div>
              {step.nextExercise && (
                <div className="mt-8 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 w-full">
                  <div className="text-zinc-500 text-sm mb-1 font-medium">Siguiente</div>
                  <div className="text-xl font-bold text-white">{step.nextExercise}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Alarm Overlay */}
        <AnimatePresence>
          {isAlarmRinging && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-red-600 flex flex-col items-center justify-center p-6 text-center pointer-events-auto"
              onClick={advanceStep}
            >
              <Volume2 className="w-24 h-24 text-white mb-8 animate-pulse" />
              <h2 className="text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                ¡Tiempo de<br />Descanso<br />Terminado!
              </h2>
              <p className="text-red-200 text-xl font-bold mt-8">Toca cualquier parte para continuar</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderDone = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6"
    >
      <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-emerald-500" />
      </div>
      <h2 className="text-4xl font-black text-white">¡Entrenamiento Completado!</h2>
      <p className="text-zinc-400 text-lg">Excelente trabajo hoy.</p>
      <button
        onClick={() => setScreen('home')}
        className="mt-8 px-8 py-4 bg-white text-black rounded-full font-bold text-lg w-full"
      >
        Volver al Inicio
      </button>
    </motion.div>
  );

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-zinc-950 text-white overflow-hidden font-sans selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        {screen === 'home' && renderHome()}
        {screen === 'countdown' && renderCountdown()}
        {screen === 'workout' && renderWorkout()}
        {screen === 'done' && renderDone()}
      </AnimatePresence>
    </div>
  );
}
