import React, { useState, useEffect, useRef } from 'react';
import { routines } from './data/routines';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronRight, CheckCircle, Timer, Dumbbell, Activity, Volume2, X, Share2, Edit2, Pause, ArrowLeft, GripHorizontal, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

type Screen = 'home' | 'countdown' | 'workout' | 'done';

// Background animated component for the "World-Class" feel
const BackgroundGlow = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
    </div>
);

export default function MainApp() {
    const [screen, setScreen] = useState<Screen>('home');
    const [selectedDay, setSelectedDay] = useState<string>('Lunes');
    const [stepIndex, setStepIndex] = useState(0);
    const [restTimeLeft, setRestTimeLeft] = useState(0);
    const [isAlarmRinging, setIsAlarmRinging] = useState(false);
    const [countdown, setCountdown] = useState(30);

    // New UX states
    const [isPauseMenuOpen, setIsPauseMenuOpen] = useState(false);

    const [workoutStats, setWorkoutStats] = useState<{ title: string, duration: number, block: string, seriesInfo: string, reps: string, weight: string }[]>([]);
    const [modifiedSteps, setModifiedSteps] = useState<Record<number, { reps?: string, weight?: string }>>({});

    // Bottom Sheet states
    const [showEditSheet, setShowEditSheet] = useState(false);
    const [editForm, setEditForm] = useState({ reps: '', weight: '' });

    const audioCtxRef = useRef<AudioContext | null>(null);
    const alarmIntervalRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const workoutStartTimeRef = useRef<number | null>(null);
    const exerciseStartTimeRef = useRef<number | null>(null);

    const startAlarm = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        if (alarmIntervalRef.current) return;

        const playBeep = () => {
            // Highly unpleasant, urgent double frequency beep
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
        // Faster interval to make it more stressful/urgent
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
        // Pausing the timer if Pause Menu or Edit Sheet is open might be a good idea, 
        // but traditionally rest timers keep going. We'll let it flow unless paused explicitly.
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

    const renderHome = () => (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full relative"
        >
            <div className="flex flex-col items-center justify-center p-8 pt-16 space-y-3 z-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-4"
                >
                    <Activity className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-2 text-center">Entrenamiento</h1>
                <p className="text-zinc-400 text-center font-medium">Selecciona tu rutina para comenzar</p>
            </div>

            <div className="flex-1 px-6 pb-12 overflow-y-auto space-y-4 z-10">
                {Object.keys(routines).map((day, idx) => (
                    <motion.button
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + idx * 0.1 }}
                        key={day}
                        onClick={() => handleStartRoutine(day)}
                        className="w-full relative overflow-hidden group rounded-[2rem] p-6 flex items-center justify-between transition-all bg-white/5 border border-white/10 hover:bg-white/10 active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center space-x-5 relative z-10">
                            <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 backdrop-blur-md">
                                {day === 'Lunes' || day === 'Jueves' ? <Activity className="w-6 h-6" /> : <Dumbbell className="w-6 h-6" />}
                            </div>
                            <div className="text-left">
                                <h2 className="text-2xl font-bold text-white mb-1">{day}</h2>
                                <p className="text-sm font-medium text-zinc-400">
                                    {day === 'Lunes' || day === 'Jueves' ? 'Tren Superior' : day === 'Martes' ? 'Tren Inferior 1' : 'Tren Inferior 2'}
                                </p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center relative z-10 group-hover:bg-indigo-500 transition-colors">
                            <Play className="w-5 h-5 text-white ml-1" />
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );

    const renderCountdown = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full p-6 relative"
        >
            <button
                onClick={exitToHome}
                className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md transition-colors z-[100]"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-bold text-zinc-300 mb-12 tracking-wide">Prepárate</h2>
            <div className="relative flex items-center justify-center">
                {/* Glowing ring */}
                <div className="absolute inset-0 rounded-full bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
                <div className="relative w-72 h-72 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="144" cy="144" r="136" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                        <circle
                            cx="144" cy="144" r="136"
                            stroke="url(#gradient)" strokeWidth="12" fill="transparent"
                            strokeDasharray={2 * Math.PI * 136}
                            strokeDashoffset={2 * Math.PI * 136 * (1 - countdown / 30)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="text-8xl font-black text-white">{countdown}</span>
                </div>
            </div>
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
                className="absolute bottom-12 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-white/10 flex items-center gap-2 z-50"
            >
                Saltar Countdown <ChevronRight className="w-5 h-5" />
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
                {/* Top Navigation Bar */}
                <div className="pt-6 px-6 pb-2 flex items-center justify-between z-40 relative">
                    <button
                        onClick={() => setIsPauseMenuOpen(true)}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md active:scale-95 transition-all"
                    >
                        <Pause className="w-5 h-5 fill-current" />
                    </button>

                    {/* Progress dots or indicator */}
                    <div className="flex-1 px-6">
                        <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    <div className="text-xs font-bold text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                        {stepIndex + 1} / {routine.length}
                    </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-center relative z-30 pb-52">
                    {step.type === 'exercise' ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-bold text-indigo-400 tracking-wide">
                                    <span className="bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{step.block}</span>
                                    <span className="text-zinc-400 px-3 py-1">{step.seriesInfo}</span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-lg flex items-center justify-between">
                                    {step.title}
                                </h2>
                            </div>

                            {/* Interactive Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={openEditSheet}
                                    className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-5 text-left border border-white/10 relative overflow-hidden group hover:bg-white/10 active:scale-95 transition-all flex flex-col justify-center h-32"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Edit2 className="w-4 h-4 text-zinc-400" />
                                    </div>
                                    <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Repeticiones</div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                                            {(modifiedSteps[stepIndex]?.reps || step.reps).replace(/reps?/i, '').trim()}
                                        </span>
                                        <span className="text-zinc-400 font-bold text-sm">reps</span>
                                    </div>
                                </button>

                                {(modifiedSteps[stepIndex]?.weight || step.weight) ? (
                                    <button
                                        onClick={openEditSheet}
                                        className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-5 text-left relative overflow-hidden group hover:border-indigo-500/50 active:scale-95 transition-all flex flex-col justify-center h-32 shadow-xl"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit2 className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1 relative z-10">Carga</div>
                                        <div className="flex items-baseline gap-1 leading-none relative z-10">
                                            {(() => {
                                                const w = (modifiedSteps[stepIndex]?.weight || step.weight) as string;
                                                const parts = w.split(' ');
                                                if (parts.length === 3 && parts[0].includes('x')) {
                                                    return (
                                                        <>
                                                            <span className="text-zinc-400 font-bold text-xl">{parts[0]}</span>
                                                            <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">{parts[1]}</span>
                                                            <span className="text-zinc-400 font-bold text-sm">{parts[2]}</span>
                                                        </>
                                                    );
                                                } else if (parts.length === 2) {
                                                    return (
                                                        <>
                                                            <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">{parts[0]}</span>
                                                            <span className="text-zinc-400 font-bold text-sm">{parts[1]}</span>
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

                            <div className="bg-indigo-950/30 backdrop-blur-md rounded-3xl p-6 border border-indigo-500/20 shadow-inner">
                                <div className="text-indigo-300 text-sm mb-2 font-bold uppercase tracking-wider flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Tips
                                </div>
                                <p className="text-indigo-100 text-lg leading-relaxed">{step.notes}</p>
                            </div>

                            {step.muscles && step.muscles.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest pl-1">Activación Muscular</div>
                                    <div className="flex flex-wrap gap-2">
                                        {step.muscles.map((muscle: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`px-4 py-2 rounded-2xl text-sm font-bold border flex items-center gap-2 backdrop-blur-md
                          ${muscle.type === 'primary'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : 'bg-white/5 text-zinc-300 border-white/10'
                                                    } `}
                                            >
                                                <span>{muscle.name}</span>
                                                <span className={`${muscle.type === 'primary' ? 'text-emerald-500' : 'text-zinc-500'} tabular-nums`}>{muscle.percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-6 text-center h-full">
                            <div className="relative">
                                {/* Timer background effects */}
                                <div className="absolute inset-0 rounded-full bg-blue-500 blur-3xl opacity-10 animate-pulse" />
                                <div className="w-64 h-64 relative flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                        <circle cx="128" cy="128" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                                        <circle
                                            cx="128" cy="128" r="120"
                                            stroke="currentColor" strokeWidth="8" fill="transparent"
                                            strokeDasharray={2 * Math.PI * 120}
                                            strokeDashoffset={2 * Math.PI * 120 * (1 - restTimeLeft / step.duration)}
                                            strokeLinecap="round"
                                            className="text-blue-500 transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                        />
                                    </svg>
                                    <div className="text-7xl font-black text-white tabular-nums tracking-tighter">
                                        {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-400 uppercase tracking-widest">Descanso</h2>

                            {step.nextExercise && (
                                <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 w-full text-left">
                                    <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Siguiente Ejercicio</div>
                                    <div className="text-2xl font-black text-white line-clamp-2">{step.nextExercise}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Action Button - Floating at bottom */}
                <div className="fixed bottom-0 left-0 w-full p-6 z-40 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pb-8">
                    <button
                        onClick={advanceStep}
                        className="w-full h-20 bg-white text-black rounded-3xl font-black text-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(255,255,255,0.15)] overflow-hidden relative group"
                    >
                        {step.type === 'exercise' ? (
                            <>
                                <CheckCircle className="w-7 h-7" /> COMPLETAR SERIE
                            </>
                        ) : (
                            <>
                                SALTAR DESCANSO <ChevronRight className="w-6 h-6" />
                            </>
                        )}
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                    </button>
                    {nextDifferentExercise && step.type === 'exercise' && (
                        <div className="text-center mt-4">
                            <span className="text-zinc-500 text-sm font-bold tracking-wide">Sig: <span className="text-zinc-300">{nextDifferentExercise}</span></span>
                        </div>
                    )}
                </div>

                {/* Alarm Overlay - Visual redesign but maintaining the sound */}
                <AnimatePresence>
                    {isAlarmRinging && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[150] bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 pointer-events-auto"
                        >
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[120%] h-[120%] bg-blue-600/30 blur-[150px] animate-pulse" />
                            </div>

                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-32 h-32 rounded-full bg-blue-500/20 border-4 border-blue-500 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.6)] mb-8"
                            >
                                <Volume2 className="w-16 h-16 text-blue-400 relative z-10" />
                            </motion.div>

                            <h2 className="text-5xl font-black text-white tracking-widest uppercase mb-2 relative z-10">
                                ¡TIEMPO!
                            </h2>
                            <p className="text-blue-200 text-xl font-medium mb-12 relative z-10">Vuelve al entrenamiento</p>

                            <button
                                onClick={advanceStep}
                                className="w-full max-w-sm py-6 bg-blue-600 text-white rounded-full font-black text-2xl tracking-wide shadow-[0_10px_30px_rgba(37,99,235,0.4)] active:scale-95 transition-all relative z-10"
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
                                className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm pointer-events-auto"
                            />
                            <motion.div
                                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="absolute bottom-0 left-0 w-full bg-zinc-900 border-t border-white/10 rounded-t-[3rem] p-6 pb-16 z-[201] pointer-events-auto shadow-2xl"
                            >
                                <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-8" />
                                <h3 className="text-2xl font-black text-white mb-6">Ajustar Serie</h3>

                                <div className="space-y-5">
                                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-3xl p-5">
                                        <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">Repeticiones</label>
                                        <input
                                            type="text"
                                            value={editForm.reps}
                                            onChange={e => setEditForm({ ...editForm, reps: e.target.value })}
                                            className="w-full bg-transparent text-white font-black text-3xl focus:outline-none placeholder-zinc-700"
                                        />
                                    </div>
                                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-3xl p-5">
                                        <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">Carga</label>
                                        <input
                                            type="text"
                                            value={editForm.weight}
                                            onChange={e => setEditForm({ ...editForm, weight: e.target.value })}
                                            className="w-full bg-transparent text-white font-black text-3xl focus:outline-none placeholder-zinc-700"
                                            placeholder="Ej: 2x 15.3 kg"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={saveEdit}
                                    className="w-full mt-8 py-5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-black text-lg shadow-[0_10px_30px_rgba(99,102,241,0.3)] active:scale-95 transition-all"
                                >
                                    Guardar Cambios
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Pause / Exit Menu Bottom Sheet */}
                <AnimatePresence>
                    {isPauseMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setIsPauseMenuOpen(false)}
                                className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md pointer-events-auto"
                            />
                            <motion.div
                                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="absolute bottom-0 left-0 w-full bg-zinc-900 border-t border-white/10 rounded-t-[3rem] p-6 pb-16 z-[201] pointer-events-auto"
                            >
                                <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-8" />
                                <h3 className="text-3xl font-black text-white mb-2">Pausa</h3>
                                <p className="text-zinc-400 mb-8 font-medium">¿Qué deseas hacer?</p>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setIsPauseMenuOpen(false)}
                                        className="w-full py-5 bg-white text-black rounded-full font-black text-lg hover:bg-zinc-200 active:scale-95 transition-all"
                                    >
                                        Reanudar Entrenamiento
                                    </button>
                                    <button
                                        onClick={exitToHome}
                                        className="w-full py-5 bg-red-500/10 text-red-500 rounded-full font-bold text-lg hover:bg-red-500/20 active:scale-95 transition-all border border-red-500/20"
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
            return m > 0 ? `${m}m ${s} s` : `${s} s`;
        };

        const totalWorkoutTime = workoutStartTimeRef.current ? Math.floor((Date.now() - workoutStartTimeRef.current) / 1000) : 0;

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
            // Here you could add html2canvas library in the future for actual screenshots
            alert("Toma una captura de esta pantalla para compartir tu entrenamiento.");
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full bg-zinc-950 overflow-hidden relative"
            >
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[50%] bg-gradient-to-b from-indigo-600/30 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="pt-12 px-8 pb-6 relative z-10 flex justify-between items-start">
                    <div>
                        <div className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-xs font-bold mb-3 border border-white/20 backdrop-blur-md uppercase tracking-widest">
                            {selectedDay}
                        </div>
                        <h2 className="text-4xl font-black text-white leading-tight">
                            Entrenamiento<br />Completado
                        </h2>
                    </div>
                    <button onClick={handleShare} className="w-12 h-12 flex items-center justify-center bg-indigo-500 rounded-full text-white shadow-lg active:scale-95 transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-8 flex gap-4 relative z-10 mb-8">
                    <div className="flex-1 bg-white/5 p-4 rounded-3xl backdrop-blur-md border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Tiempo</div>
                        <div className="text-3xl font-black text-white">{formatTime(totalWorkoutTime)}</div>
                    </div>
                    <div className="flex-1 bg-white/5 p-4 rounded-3xl backdrop-blur-md border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/20 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Series</div>
                        <div className="text-3xl font-black text-white">{workoutStats.length}</div>
                    </div>
                </div>

                <div className="flex-1 px-4 min-h-0 relative z-10 pb-24">
                    <div className="h-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-5 flex flex-col overflow-hidden shadow-2xl">
                        <h3 className="text-sm font-bold text-zinc-400 mb-4 px-2 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-400" />
                            Log de Ejercicios
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar pb-4">
                            {exerciseList.map((exercise, idx) => (
                                <div key={idx} className="bg-black/40 border border-white/5 rounded-2xl p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-bold text-sm leading-tight pr-4">{exercise.title}</h4>
                                        <div className="bg-white/10 text-white px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">{exercise.series} Series</div>
                                    </div>
                                    <div className="flex justify-between items-end mt-3">
                                        <div className="space-y-1.5 min-w-0 pr-4">
                                            {Array.from(exercise.reps).length > 0 && (
                                                <div className="text-indigo-200 text-xs font-medium truncate">
                                                    Reps: {Array.from(exercise.reps).join(' / ')}
                                                </div>
                                            )}
                                            {Array.from(exercise.weights).length > 0 && (
                                                <div className="text-purple-200 text-xs font-medium truncate">
                                                    Carga: {Array.from(exercise.weights).join(' / ')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-emerald-400 font-black text-sm tabular-nums whitespace-nowrap">
                                            {calculateScore(exercise)} pt
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 pt-12 pb-10 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-20">
                    <button
                        onClick={exitToHome}
                        className="w-full py-5 bg-white text-black rounded-full font-black text-lg active:scale-95 transition-transform"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="h-[100dvh] w-full relative overflow-hidden bg-zinc-950 text-white selection:bg-indigo-500/30">
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
