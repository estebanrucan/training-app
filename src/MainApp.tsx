import React, { useState, useEffect, useRef } from 'react';
import { routines } from './data/routines';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronRight, CheckCircle, Timer, Dumbbell, Activity, Volume2, X, Share2, Edit2, Pause, ArrowLeft, GripHorizontal, AlertCircle, Flame, Trophy, Zap, Clock, Target, Thermometer } from 'lucide-react';

type Screen = 'home' | 'countdown' | 'workout' | 'done';

// Animated background component
const BackgroundGlow = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] bg-yellow-500/12 rounded-full mix-blend-screen filter blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-amber-600/10 rounded-full mix-blend-screen filter blur-[140px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-yellow-400/5 rounded-full mix-blend-screen filter blur-[80px] animate-glow-pulse" style={{ animationDelay: '4s' }} />
    </div>
);

export default function MainApp() {
    const [screen, setScreen] = useState<Screen>('home');
    const [selectedDay, setSelectedDay] = useState<string>('Lunes');
    const [stepIndex, setStepIndex] = useState(0);
    const [restTimeLeft, setRestTimeLeft] = useState(0);
    const [isAlarmRinging, setIsAlarmRinging] = useState(false);
    const [countdown, setCountdown] = useState(30);

    const [isPauseMenuOpen, setIsPauseMenuOpen] = useState(false);

    const [workoutStats, setWorkoutStats] = useState<{ title: string, duration: number, block: string, seriesInfo: string, reps: string, weight: string }[]>([]);
    const [modifiedSteps, setModifiedSteps] = useState<Record<number, { reps?: string, weight?: string }>>({});
    const [finalWorkoutTime, setFinalWorkoutTime] = useState(0);

    const [showEditSheet, setShowEditSheet] = useState(false);
    const [editForm, setEditForm] = useState({ reps: '', weight: '' });

    const audioCtxRef = useRef<AudioContext | null>(null);
    const alarmIntervalRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const workoutStartTimeRef = useRef<number | null>(null);
    const exerciseStartTimeRef = useRef<number | null>(null);

    // Live clock
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Santiago temperature from Open-Meteo (free, no API key)
    const [temperature, setTemperature] = useState<number | null>(null);
    useEffect(() => {
        const fetchTemp = () => {
            fetch('https://api.open-meteo.com/v1/forecast?latitude=-33.45&longitude=-70.65&current=temperature_2m&timezone=America/Santiago')
                .then(r => r.json())
                .then(data => {
                    if (data?.current?.temperature_2m != null) {
                        setTemperature(Math.round(data.current.temperature_2m));
                    }
                })
                .catch(() => { });
        };
        fetchTemp();
        const interval = setInterval(fetchTemp, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const startAlarm = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        if (alarmIntervalRef.current) return;

        const playBeep = () => {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(1000, ctx.currentTime);
            osc1.frequency.linearRampToValueAtTime(1300, ctx.currentTime + 0.2);

            osc2.type = 'square';
            osc2.frequency.setValueAtTime(1050, ctx.currentTime);
            osc2.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start();
            osc2.start();
            osc1.stop(ctx.currentTime + 0.35);
            osc2.stop(ctx.currentTime + 0.35);
        };

        playBeep();
        alarmIntervalRef.current = window.setInterval(playBeep, 400);
        setIsAlarmRinging(true);
    };

    const stopAlarm = () => {
        if (alarmIntervalRef.current) {
            clearInterval(alarmIntervalRef.current);
            alarmIntervalRef.current = null;
        }
        setIsAlarmRinging(false);
    };

    const exitToHome = () => {
        setScreen('home');
        setStepIndex(0);
        stopAlarm();
        if (timerRef.current) clearInterval(timerRef.current);
        setIsPauseMenuOpen(false);
        setWorkoutStats([]);
        setModifiedSteps({});
        workoutStartTimeRef.current = null;
        exerciseStartTimeRef.current = null;
    };

    const handleStartRoutine = (day: string) => {
        setSelectedDay(day);
        setScreen('countdown');
        setCountdown(30);
    };

    const openEditSheet = () => {
        const routine = routines[selectedDay];
        const step = routine[stepIndex];
        if (step && step.type === 'exercise') {
            const currentModified = modifiedSteps[stepIndex] || {};
            setEditForm({
                reps: currentModified.reps || step.reps,
                weight: currentModified.weight || step.weight || ''
            });
            setShowEditSheet(true);
        }
    };

    const saveEdit = () => {
        setModifiedSteps(prev => ({
            ...prev,
            [stepIndex]: { ...editForm }
        }));
        setShowEditSheet(false);
    };

    const advanceStep = () => {
        stopAlarm();
        if (timerRef.current) clearInterval(timerRef.current);

        const routine = routines[selectedDay];
        const currentStep = routine[stepIndex];

        if (currentStep && currentStep.type === 'exercise' && exerciseStartTimeRef.current) {
            const duration = Math.floor((Date.now() - exerciseStartTimeRef.current) / 1000);
            const currentModified = modifiedSteps[stepIndex] || {};
            setWorkoutStats(prev => [...prev, {
                title: currentStep.title,
                duration,
                block: currentStep.block,
                seriesInfo: currentStep.seriesInfo,
                reps: currentModified.reps || currentStep.reps,
                weight: currentModified.weight || currentStep.weight || ''
            }]);
            exerciseStartTimeRef.current = null;
        }

        if (stepIndex + 1 < routine.length) {
            const nextStep = routine[stepIndex + 1];
            setStepIndex(stepIndex + 1);
            if (nextStep.type === 'rest') {
                setRestTimeLeft(nextStep.duration);
            } else if (nextStep.type === 'exercise') {
                exerciseStartTimeRef.current = Date.now();
            }
        } else {
            const totalTime = workoutStartTimeRef.current ? Math.floor((Date.now() - workoutStartTimeRef.current) / 1000) : 0;
            setFinalWorkoutTime(totalTime);
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
                        workoutStartTimeRef.current = Date.now();
                        const firstStep = routines[selectedDay][0];
                        if (firstStep && firstStep.type === 'exercise') {
                            exerciseStartTimeRef.current = Date.now();
                        }
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
        if (screen === 'workout' && !isPauseMenuOpen && !showEditSheet) {
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
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [screen, stepIndex, restTimeLeft, isAlarmRinging, selectedDay, isPauseMenuOpen, showEditSheet]);

    // Get current date info
    const today = new Date();
    const dayName = today.toLocaleDateString('es-CL', { weekday: 'long' });
    const dateStr = today.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });

    const getRoutineSubtitle = (day: string) => {
        if (day === 'Lunes' || day === 'Jueves') return 'Tren Superior';
        if (day === 'Martes') return 'Tren Inferior I';
        return 'Tren Inferior II';
    };

    const getRoutineExerciseCount = (day: string) => {
        return routines[day].filter(s => s.type === 'exercise').length;
    };

    const timeHours = currentTime.getHours().toString().padStart(2, '0');
    const timeMinutes = currentTime.getMinutes().toString().padStart(2, '0');
    const showColon = currentTime.getSeconds() % 2 === 0;

    const renderHome = () => (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full relative"
        >
            {/* Header */}
            <div className="px-7 pt-10 pb-3 relative z-10">
                <motion.div
                    initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
                    className="flex items-center gap-2 mb-3"
                >
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-breathe" />
                    <span className="text-zinc-500 text-sm font-semibold capitalize">{dayName}, {dateStr}</span>
                </motion.div>

                <motion.div
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                >
                    <h1 className="text-4xl font-black tracking-tight text-white leading-[1.1] mb-1">
                        Hola, <span className="text-gradient-gold">Esteban</span>
                    </h1>
                </motion.div>

                {/* Clock & Weather Row */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }}
                    className="flex items-center gap-3 mt-3"
                >
                    {/* Clock pill */}
                    <div className="flex items-center gap-2 glass-card rounded-2xl px-4 py-2.5">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-black text-lg tabular-nums tracking-tight">
                            {timeHours}<span className={showColon ? 'opacity-100' : 'opacity-30'} style={{ transition: 'opacity 0.3s' }}>:</span>{timeMinutes}
                        </span>
                    </div>

                    {/* Temperature pill */}
                    <div className="flex items-center gap-2 glass-card rounded-2xl px-4 py-2.5">
                        <Thermometer className="w-4 h-4 text-yellow-400" />
                        {temperature !== null ? (
                            <span className="text-white font-black text-lg tabular-nums">{temperature}°C</span>
                        ) : (
                            <span className="text-zinc-600 font-bold text-sm">···</span>
                        )}
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                    className="text-zinc-500 text-sm font-medium mt-3"
                >
                    Selecciona tu rutina para comenzar
                </motion.p>
            </div>

            {/* Routine Cards */}
            <div className="flex-1 px-5 pb-6 overflow-hidden space-y-2.5 z-10">
                {Object.keys(routines).map((day, idx) => (
                    <motion.button
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + idx * 0.08, type: 'spring', stiffness: 300, damping: 30 }}
                        key={day}
                        onClick={() => handleStartRoutine(day)}
                        className="w-full relative overflow-hidden group rounded-[1.5rem] p-4 flex items-center justify-between transition-all glass-card hover:bg-white/8 active:scale-[0.97]"
                    >
                        {/* Hover gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-600/10 flex items-center justify-center text-yellow-400 border border-yellow-500/10">
                                {day === 'Lunes' || day === 'Jueves' ? <Activity className="w-6 h-6" /> : <Dumbbell className="w-6 h-6" />}
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-extrabold text-white mb-0.5 tracking-tight">{day}</h2>
                                <p className="text-sm font-semibold text-zinc-500">{getRoutineSubtitle(day)}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[11px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">
                                        {getRoutineExerciseCount(day)} ejercicios
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center relative z-10 group-hover:bg-yellow-400 group-hover:text-zinc-950 transition-all duration-300 group-hover:glow-yellow">
                            <Play className="w-5 h-5 text-zinc-400 ml-0.5 group-hover:text-zinc-950 transition-colors" />
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );

    const renderCountdown = () => {
        // Build compact workout preview grouped by block
        const routine = routines[selectedDay];
        const exercisesByBlock: Record<string, { title: string, reps: string, weight?: string, count: number }[]> = {};
        routine.forEach(step => {
            if (step.type === 'exercise') {
                if (!exercisesByBlock[step.block]) exercisesByBlock[step.block] = [];
                const existing = exercisesByBlock[step.block].find(e => e.title === step.title);
                if (existing) {
                    existing.count += 1;
                } else {
                    exercisesByBlock[step.block].push({ title: step.title, reps: step.reps, weight: step.weight, count: 1 });
                }
            }
        });

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col h-full relative"
            >
                <button
                    onClick={exitToHome}
                    className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-2xl glass-card text-zinc-400 hover:text-white transition-colors z-[100] active:scale-90"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Top section with timer */}
                <div className="flex flex-col items-center pt-10 pb-2">
                    <motion.h2
                        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                        className="text-sm font-bold text-zinc-500 mb-2 tracking-widest uppercase"
                    >
                        Prepárate
                    </motion.h2>

                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-32 h-32 rounded-full border border-yellow-500/10" style={{ animation: 'ring-rotate 20s linear infinite' }} />
                        <div className="absolute w-28 h-28 rounded-full bg-yellow-400/8 blur-3xl animate-glow-pulse" />

                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle cx="56" cy="56" r="50" stroke="rgba(255,255,255,0.04)" strokeWidth="3" fill="transparent" />
                                <circle
                                    cx="56" cy="56" r="50"
                                    stroke="url(#countdownGradient)" strokeWidth="4" fill="transparent"
                                    strokeDasharray={2 * Math.PI * 50}
                                    strokeDashoffset={2 * Math.PI * 50 * (1 - countdown / 30)}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-linear"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.4))' }}
                                />
                                <defs>
                                    <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#facc15" />
                                        <stop offset="100%" stopColor="#f59e0b" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <motion.span
                                key={countdown}
                                initial={{ scale: 1.2, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-black text-white tabular-nums"
                            >
                                {countdown}
                            </motion.span>
                        </div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className="text-zinc-500 mt-2 font-bold text-xs"
                    >
                        {selectedDay} — {getRoutineSubtitle(selectedDay)}
                    </motion.p>
                </div>

                {/* Workout preview */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    className="flex-1 overflow-hidden px-5 pb-20"
                >
                    <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.15em] mb-2 flex items-center gap-2 pl-1">
                        <Dumbbell className="w-3 h-3" /> Resumen del entrenamiento
                    </div>
                    <div className="space-y-1.5">
                        {Object.entries(exercisesByBlock).map(([block, exercises], blockIdx) => (
                            <div key={block} className="glass-card rounded-xl p-2.5 space-y-1">
                                <div className="text-[10px] font-bold text-yellow-400/80 tracking-wide uppercase">{block}</div>
                                {exercises.map((ex, exIdx) => (
                                    <div key={exIdx} className="flex items-center justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-bold text-[12px] leading-tight truncate">{ex.title}</div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[11px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-lg">{ex.count}x{ex.reps.replace(/reps?/i, '').trim()}</span>
                                            {ex.weight && (
                                                <span className="text-[11px] font-bold text-yellow-400/70 bg-yellow-500/8 px-2 py-0.5 rounded-lg">{ex.weight}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Skip button */}
                <div className="fixed bottom-0 left-0 w-full px-5 pt-4 z-50 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent pb-4">
                    <button
                        onClick={() => {
                            setScreen('workout');
                            setStepIndex(0);
                            workoutStartTimeRef.current = Date.now();
                            const firstStep = routines[selectedDay][0];
                            if (firstStep && firstStep.type === 'exercise') {
                                exerciseStartTimeRef.current = Date.now();
                            }
                        }}
                        className="w-full h-[52px] bg-white text-zinc-950 rounded-2xl font-black text-base active:scale-95 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.08)] flex items-center justify-center gap-2"
                    >
                        Saltar <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        );
    };

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
                initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}
                className="flex flex-col h-full relative"
            >
                {/* Top Navigation Bar */}
                <div className="pt-4 px-5 pb-2 flex items-center justify-between z-40 relative">
                    <button
                        onClick={() => setIsPauseMenuOpen(true)}
                        className="w-11 h-11 flex items-center justify-center rounded-xl glass-card text-white active:scale-90 transition-all"
                    >
                        <Pause className="w-4 h-4 fill-current" />
                    </button>

                    {/* Progress bar */}
                    <div className="flex-1 px-5">
                        <div className="relative h-[5px] w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                            {/* Glow dot at progress tip */}
                            <div
                                className="absolute top-[-3px] h-[11px] w-[11px] bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.6)] transition-all duration-500"
                                style={{ left: `calc(${progress}% - 5px)` }}
                            />
                        </div>
                    </div>

                    <div className="text-[11px] font-bold text-zinc-500 glass-card px-3 py-1.5 rounded-xl">
                        {stepIndex + 1}/{routine.length}
                    </div>
                </div>

                <div className="flex-1 px-5 pt-2 pb-28 flex flex-col relative z-30 overflow-hidden">
                    {step.type === 'exercise' ? (
                        <div className="flex flex-col flex-1 gap-5">
                            {/* Block & Series info + Title */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-500/15 tracking-wide">{step.block}</span>
                                    <span className="text-xs font-bold text-zinc-500 bg-white/5 px-3 py-1.5 rounded-xl">{step.seriesInfo}</span>
                                </div>
                                <h2 className="text-[1.6rem] font-black text-white leading-snug tracking-tight">{step.title}</h2>
                            </div>

                            {/* Reps & Weight cards */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={openEditSheet}
                                    className="glass-card-strong rounded-[1.5rem] p-4 text-left relative overflow-hidden group active:scale-[0.97] transition-all flex flex-col justify-center min-h-[100px]"
                                >
                                    <div className="absolute top-3 right-3 opacity-0 group-active:opacity-100 transition-opacity">
                                        <Edit2 className="w-3.5 h-3.5 text-zinc-500" />
                                    </div>
                                    <div className="text-zinc-500 text-[11px] font-bold tracking-[0.12em] uppercase mb-2">Repeticiones</div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-5xl font-black text-white tracking-tighter">
                                            {(modifiedSteps[stepIndex]?.reps || step.reps).replace(/reps?/i, '').trim()}
                                        </span>
                                        <span className="text-zinc-500 font-bold text-xs">reps</span>
                                    </div>
                                </button>

                                {(modifiedSteps[stepIndex]?.weight || step.weight) ? (
                                    <button
                                        onClick={openEditSheet}
                                        className="relative rounded-[1.5rem] p-4 text-left overflow-hidden group active:scale-[0.97] transition-all flex flex-col justify-center min-h-[100px] bg-gradient-to-br from-yellow-500/10 via-zinc-900 to-zinc-900 border border-yellow-500/15"
                                    >
                                        <div className="absolute top-3 right-3 opacity-0 group-active:opacity-100 transition-opacity">
                                            <Edit2 className="w-3.5 h-3.5 text-zinc-500" />
                                        </div>
                                        <div className="text-zinc-500 text-[11px] font-bold tracking-[0.12em] uppercase mb-2 relative z-10">Carga</div>
                                        <div className="flex items-baseline gap-1 leading-none relative z-10">
                                            {(() => {
                                                const w = (modifiedSteps[stepIndex]?.weight || step.weight) as string;
                                                const parts = w.split(' ');
                                                if (parts.length === 3 && parts[0].includes('x')) {
                                                    return (
                                                        <>
                                                            <span className="text-yellow-400/70 font-bold text-xl">{parts[0]}</span>
                                                            <span className="text-5xl font-black text-white tracking-tighter">{parts[1]}</span>
                                                            <span className="text-zinc-500 font-bold text-xs">{parts[2]}</span>
                                                        </>
                                                    );
                                                } else if (parts.length === 2) {
                                                    return (
                                                        <>
                                                            <span className="text-5xl font-black text-white tracking-tighter">{parts[0]}</span>
                                                            <span className="text-zinc-500 font-bold text-xs">{parts[1]}</span>
                                                        </>
                                                    );
                                                } else {
                                                    return <span className="text-3xl font-black text-white tracking-tighter leading-tight break-words">{w}</span>;
                                                }
                                            })()}
                                        </div>
                                    </button>
                                ) : (
                                    <div />
                                )}
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-br from-yellow-950/30 to-yellow-950/10 backdrop-blur-md rounded-2xl p-4 border border-yellow-500/15">
                                <div className="text-yellow-400/80 text-[10px] mb-2 font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                                    <Zap className="w-3.5 h-3.5" /> Técnica
                                </div>
                                <p className="text-yellow-100/80 text-[15px] leading-relaxed font-medium">{step.notes}</p>
                            </div>

                            {/* Muscle Activation */}
                            {step.muscles && step.muscles.length > 0 && (
                                <div className="space-y-2.5">
                                    <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.15em] pl-1 flex items-center gap-2">
                                        <Target className="w-3 h-3" /> Activación Muscular
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {step.muscles.map((muscle: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`px-3.5 py-2 rounded-xl text-sm font-bold border flex items-center gap-2
                          ${muscle.type === 'primary'
                                                        ? 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15'
                                                        : 'bg-white/3 text-zinc-400 border-white/8'
                                                    }`}
                                            >
                                                <span>{muscle.name}</span>
                                                <span className={`${muscle.type === 'primary' ? 'text-emerald-500/60' : 'text-zinc-600'} tabular-nums text-[11px]`}>{muscle.percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        /* REST SCREEN */
                        <div className="flex flex-col items-center justify-center space-y-3 text-center h-full my-auto">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-yellow-400 blur-3xl opacity-8 animate-glow-pulse" />
                                <div className="w-44 h-44 relative flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                        <circle cx="88" cy="88" r="82" stroke="rgba(255,255,255,0.04)" strokeWidth="4" fill="transparent" />
                                        <circle
                                            cx="88" cy="88" r="82"
                                            stroke="url(#restGradient)" strokeWidth="5" fill="transparent"
                                            strokeDasharray={2 * Math.PI * 82}
                                            strokeDashoffset={2 * Math.PI * 82 * (1 - restTimeLeft / step.duration)}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-linear"
                                            style={{ filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.4))' }}
                                        />
                                        <defs>
                                            <linearGradient id="restGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#facc15" />
                                                <stop offset="100%" stopColor="#f59e0b" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="text-5xl font-black text-white tabular-nums tracking-tighter">
                                        {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-zinc-500 uppercase tracking-[0.2em]">Descanso</h2>

                            {step.nextExercise && (
                                <div className="glass-card rounded-2xl p-4 w-full text-left mt-2">
                                    <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                                        <ChevronRight className="w-3 h-3" /> Siguiente
                                    </div>
                                    <div className="text-xl font-black text-white line-clamp-2">{step.nextExercise}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Action Button */}
                <div className="fixed bottom-0 left-0 w-full px-5 pt-6 z-40 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent pb-4">
                    <button
                        onClick={advanceStep}
                        className={`w-full h-[72px] rounded-2xl font-black text-xl flex items-center justify-center gap-3 active:scale-[0.97] transition-all overflow-hidden relative group
                            ${step.type === 'exercise'
                                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-zinc-950 glow-yellow-strong'
                                : 'bg-white text-zinc-950'
                            }`}
                    >
                        {step.type === 'exercise' ? (
                            <>
                                <CheckCircle className="w-6 h-6" /> COMPLETAR SERIE
                            </>
                        ) : (
                            <>
                                SALTAR DESCANSO <ChevronRight className="w-6 h-6" />
                            </>
                        )}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
                    </button>
                    {nextDifferentExercise && step.type === 'exercise' && (
                        <div className="text-center mt-3">
                            <span className="text-zinc-600 text-xs font-bold">Sig: <span className="text-zinc-400">{nextDifferentExercise}</span></span>
                        </div>
                    )}
                </div>

                {/* Alarm Overlay */}
                <AnimatePresence>
                    {isAlarmRinging && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[150] bg-zinc-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 pointer-events-auto"
                        >
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[130%] h-[130%] bg-yellow-500/15 blur-[180px] animate-glow-pulse" />
                            </div>

                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}
                                className="w-28 h-28 rounded-full bg-yellow-400/15 border-[3px] border-yellow-400 flex items-center justify-center glow-yellow-strong mb-8 relative"
                            >
                                <Volume2 className="w-14 h-14 text-yellow-400 relative z-10" />
                            </motion.div>

                            <h2 className="text-5xl font-black text-white tracking-widest uppercase mb-2 relative z-10">
                                ¡TIEMPO!
                            </h2>
                            <p className="text-yellow-200/60 text-lg font-medium mb-12 relative z-10">Vuelve al entrenamiento</p>

                            <button
                                onClick={advanceStep}
                                className="w-full max-w-sm py-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-zinc-950 rounded-2xl font-black text-xl active:scale-95 transition-all glow-yellow-strong relative z-10"
                            >
                                CONTINUAR
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Bottom Sheet */}
                <AnimatePresence>
                    {showEditSheet && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setShowEditSheet(false)}
                                className="absolute inset-0 z-[200] bg-black/70 backdrop-blur-sm pointer-events-auto"
                            />
                            <motion.div
                                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 250 }}
                                className="absolute bottom-0 left-0 w-full bg-zinc-900 border-t border-white/10 rounded-t-[2.5rem] p-6 pb-14 z-[201] pointer-events-auto shadow-2xl"
                            >
                                <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-7" />
                                <h3 className="text-xl font-black text-white mb-5">Ajustar Serie</h3>

                                <div className="space-y-4">
                                    <div className="glass-card rounded-2xl p-4">
                                        <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block">Repeticiones</label>
                                        <input
                                            type="text"
                                            value={editForm.reps}
                                            onChange={e => setEditForm({ ...editForm, reps: e.target.value })}
                                            className="w-full bg-transparent text-white font-black text-2xl focus:outline-none placeholder-zinc-700"
                                        />
                                    </div>
                                    <div className="glass-card rounded-2xl p-4">
                                        <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block">Carga</label>
                                        <input
                                            type="text"
                                            value={editForm.weight}
                                            onChange={e => setEditForm({ ...editForm, weight: e.target.value })}
                                            className="w-full bg-transparent text-white font-black text-2xl focus:outline-none placeholder-zinc-700"
                                            placeholder="Ej: 2x 15.3 kg"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={saveEdit}
                                    className="w-full mt-6 py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-zinc-950 rounded-2xl font-black text-lg active:scale-95 transition-all glow-yellow"
                                >
                                    Guardar Cambios
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Pause Menu */}
                <AnimatePresence>
                    {isPauseMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setIsPauseMenuOpen(false)}
                                className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md pointer-events-auto"
                            />
                            <motion.div
                                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 250 }}
                                className="absolute bottom-0 left-0 w-full bg-zinc-900 border-t border-white/10 rounded-t-[2.5rem] p-6 pb-14 z-[201] pointer-events-auto"
                            >
                                <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-7" />
                                <h3 className="text-2xl font-black text-white mb-1">Pausa</h3>
                                <p className="text-zinc-500 mb-7 font-medium text-sm">¿Qué deseas hacer?</p>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setIsPauseMenuOpen(false)}
                                        className="w-full py-5 bg-white text-zinc-950 rounded-2xl font-black text-lg active:scale-95 transition-all"
                                    >
                                        Reanudar Entrenamiento
                                    </button>
                                    <button
                                        onClick={exitToHome}
                                        className="w-full py-5 bg-red-500/8 text-red-400 rounded-2xl font-bold text-lg active:scale-95 transition-all border border-red-500/15"
                                    >
                                        Finalizar y Salir
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    const renderDone = () => {
        const formatTime = (seconds: number) => {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return m > 0 ? `${m}m ${s}s` : `${s}s`;
        };

        const activeTime = workoutStats.reduce((sum, s) => sum + s.duration, 0);

        type ExerciseGroup = { title: string, duration: number, series: number, weights: Set<string>, reps: Set<string>, rawStats: typeof workoutStats };
        const groupedExercises = workoutStats.reduce((acc, stat) => {
            if (!acc[stat.title]) {
                acc[stat.title] = { title: stat.title, duration: 0, series: 0, weights: new Set(), reps: new Set(), rawStats: [] };
            }
            acc[stat.title].series += 1;
            acc[stat.title].duration += stat.duration;
            acc[stat.title].rawStats.push(stat);
            if (stat.weight) acc[stat.title].weights.add(stat.weight);
            if (stat.reps) acc[stat.title].reps.add(stat.reps);
            return acc;
        }, {} as Record<string, ExerciseGroup>);

        const exerciseList = Object.values(groupedExercises) as ExerciseGroup[];

        const extractNumber = (str: string) => {
            const multMatch = str.match(/(\d+)x\s*([\d.]+)/);
            if (multMatch) return parseFloat(multMatch[1]) * parseFloat(multMatch[2]);
            const numMatch = str.match(/[\d.]+/);
            return numMatch ? parseFloat(numMatch[0]) : 0;
        };

        const calculateScore = (exercise: ExerciseGroup) => {
            if (exercise.duration === 0) return 0;
            let totalVolume = 0;
            exercise.rawStats.forEach(stat => {
                const totalKg = extractNumber(stat.weight);
                const kg = totalKg > 0 ? totalKg : 1;
                const reps = extractNumber(stat.reps);
                totalVolume += (kg * reps);
            });
            return Math.round((totalVolume / exercise.duration) * 10);
        };

        const handleShare = async () => {
            alert("Toma una captura de esta pantalla para compartir tu entrenamiento.");
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full bg-zinc-950 overflow-hidden relative"
            >
                {/* Celebration background */}
                <div className="absolute top-[-25%] left-[-25%] w-[150%] h-[55%] bg-gradient-to-b from-yellow-500/20 via-amber-600/10 to-transparent rounded-full blur-3xl pointer-events-none animate-glow-pulse" />

                {/* Header — single line */}
                <div className="pt-6 px-5 pb-2 relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center glow-yellow shrink-0"
                        >
                            <Trophy className="w-5 h-5 text-zinc-950" />
                        </motion.div>
                        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                            <h2 className="text-2xl font-black text-white leading-none">Entrenamiento <span className="text-gradient-gold">Completado</span></h2>
                            <p className="text-zinc-500 text-xs font-bold mt-1">Esteban — {selectedDay} — {getRoutineSubtitle(selectedDay)}</p>
                        </motion.div>
                    </div>
                    <motion.button
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}
                        onClick={handleShare}
                        className="w-9 h-9 flex items-center justify-center glass-card rounded-xl text-zinc-400 active:scale-90 transition-all shrink-0"
                    >
                        <Share2 className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Stats — compact inline row */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    className="px-5 flex gap-2 relative z-10 mb-2"
                >
                    <div className="flex-1 glass-card p-2.5 rounded-xl flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                            <div className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider leading-none">Total</div>
                            <div className="text-base font-black text-white leading-tight">{formatTime(finalWorkoutTime)}</div>
                        </div>
                    </div>
                    <div className="flex-1 glass-card p-2.5 rounded-xl flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-orange-400 shrink-0" />
                        <div>
                            <div className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider leading-none">Sin pausas</div>
                            <div className="text-base font-black text-white leading-tight">{formatTime(activeTime)}</div>
                        </div>
                    </div>
                    <div className="flex-1 glass-card p-2.5 rounded-xl flex items-center gap-2.5">
                        <Flame className="w-4 h-4 text-yellow-400 shrink-0" />
                        <div>
                            <div className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider leading-none">Series</div>
                            <div className="text-base font-black text-white leading-tight">{workoutStats.length}</div>
                        </div>
                    </div>
                </motion.div>

                {/* Exercise Log — ultra compact single-row items */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                    className="flex-1 px-5 min-h-0 relative z-10 pb-[72px]"
                >
                    <div className="h-full glass-card rounded-2xl p-3 flex flex-col overflow-hidden">
                        <h3 className="text-[9px] font-bold text-zinc-500 mb-2 px-1 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Activity className="w-3 h-3 text-yellow-400" />
                            Log de Ejercicios
                        </h3>
                        <div className="flex-1 overflow-hidden flex flex-col gap-1.5">
                            {exerciseList.map((exercise, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ x: 15, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + idx * 0.04 }}
                                    className="flex items-center gap-2 bg-white/3 border border-white/5 rounded-lg px-3 py-2.5 flex-1"
                                >
                                    <h4 className="text-white font-bold text-[12px] leading-tight flex-1 min-w-0 truncate">{exercise.title}</h4>
                                    <span className="text-zinc-500 text-[10px] font-bold shrink-0">{exercise.series}S</span>
                                    {Array.from(exercise.reps).length > 0 && (
                                        <span className="text-yellow-200/60 text-[10px] font-semibold shrink-0">{Array.from(exercise.reps).join('/')}</span>
                                    )}
                                    {Array.from(exercise.weights).length > 0 && (
                                        <span className="text-zinc-500 text-[10px] font-semibold shrink-0">{Array.from(exercise.weights)[0]}</span>
                                    )}
                                    <div className="text-emerald-400 font-black text-[11px] tabular-nums shrink-0 flex items-center gap-0.5">
                                        <Clock className="w-2.5 h-2.5" />
                                        {formatTime(exercise.duration)}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Button */}
                <div className="absolute bottom-0 left-0 w-full px-5 pt-6 pb-4 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-20">
                    <button
                        onClick={exitToHome}
                        className="w-full py-4 bg-white text-zinc-950 rounded-2xl font-black text-base active:scale-95 transition-all"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="h-[100dvh] w-full relative overflow-hidden bg-zinc-950 text-white selection:bg-yellow-500/30">
            <BackgroundGlow />
            <AnimatePresence mode="wait">
                {screen === 'home' && renderHome()}
                {screen === 'countdown' && renderCountdown()}
                {screen === 'workout' && renderWorkout()}
                {screen === 'done' && renderDone()}
            </AnimatePresence>
        </div>
    );
}
