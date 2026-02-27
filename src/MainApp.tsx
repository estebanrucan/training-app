import React, { useState, useEffect, useRef } from 'react';
import { routines } from './data/routines';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronRight, CheckCircle, Timer, Dumbbell, Activity, Volume2, X, Share2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

type Screen = 'home' | 'countdown' | 'workout' | 'done';

export default function MainApp() {
    const [screen, setScreen] = useState<Screen>('home');
    const [selectedDay, setSelectedDay] = useState<string>('Lunes');
    const [stepIndex, setStepIndex] = useState(0);
    const [restTimeLeft, setRestTimeLeft] = useState(0);
    const [isAlarmRinging, setIsAlarmRinging] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [isPressingExit, setIsPressingExit] = useState(false);
    const [workoutStats, setWorkoutStats] = useState<{ title: string, duration: number, block: string, seriesInfo: string }[]>([]);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const alarmIntervalRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const pressTimerRef = useRef<number | null>(null);
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

    const exitToHome = () => {
        setScreen('home');
        setStepIndex(0);
        stopAlarm();
        if (timerRef.current) clearInterval(timerRef.current);
        if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
        setIsPressingExit(false);
        setWorkoutStats([]);
        workoutStartTimeRef.current = null;
        exerciseStartTimeRef.current = null;
    };

    const handleExitPressStart = () => {
        setIsPressingExit(true);
        pressTimerRef.current = window.setTimeout(() => {
            exitToHome();
        }, 1200);
    };

    const handleExitPressEnd = () => {
        setIsPressingExit(false);
        if (pressTimerRef.current) {
            clearTimeout(pressTimerRef.current);
            pressTimerRef.current = null;
        }
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
        const currentStep = routine[stepIndex];

        if (currentStep && currentStep.type === 'exercise' && exerciseStartTimeRef.current) {
            const duration = Math.floor((Date.now() - exerciseStartTimeRef.current) / 1000);
            setWorkoutStats(prev => [...prev, {
                title: currentStep.title,
                duration,
                block: currentStep.block,
                seriesInfo: currentStep.seriesInfo
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
            className="flex flex-col items-center justify-center h-full p-6 relative"
        >
            <button
                onClick={exitToHome}
                className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-colors z-[100]"
            >
                <X className="w-5 h-5" />
            </button>
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
                onClick={() => {
                    setScreen('workout');
                    setStepIndex(0);
                    workoutStartTimeRef.current = Date.now();
                    const firstStep = routines[selectedDay][0];
                    if (firstStep && firstStep.type === 'exercise') {
                        exerciseStartTimeRef.current = Date.now();
                    }
                }}
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
                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}% ` }} />
                </div>

                {/* Exit Button - Top Left */}
                <div className="absolute top-6 left-6 z-[100] flex flex-col items-start">
                    <button
                        onMouseDown={handleExitPressStart}
                        onMouseUp={handleExitPressEnd}
                        onMouseLeave={handleExitPressEnd}
                        onTouchStart={handleExitPressStart}
                        onTouchEnd={handleExitPressEnd}
                        onContextMenu={(e) => e.preventDefault()}
                        className="relative w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 active:scale-95 transition-transform select-none"
                    >
                        <X className="w-5 h-5 text-zinc-500" />
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                            <motion.circle
                                cx="24" cy="24" r="22"
                                stroke="#ef4444" strokeWidth="4" fill="transparent"
                                initial={{ strokeDasharray: 2 * Math.PI * 22, strokeDashoffset: 2 * Math.PI * 22 }}
                                animate={{ strokeDashoffset: isPressingExit ? 0 : 2 * Math.PI * 22 }}
                                transition={{ duration: isPressingExit ? 1.2 : 0.2, ease: "linear" }}
                            />
                        </svg>
                    </button>
                    <AnimatePresence>
                        {isPressingExit && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                className="absolute top-14 left-0 whitespace-nowrap text-xs text-red-400 font-bold bg-zinc-950/80 px-2 py-1 rounded border border-red-500/20 shadow-xl"
                            >
                                Mantén para salir
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                                        {step.muscles.map((muscle: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`px - 3 py - 1.5 rounded - full text - sm font - bold border flex items - center space - x - 2
                          ${muscle.type === 'primary'
                                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                                    } `}
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

    const renderDone = () => {
        const formatTime = (seconds: number) => {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return m > 0 ? `${m}m ${s} s` : `${s} s`;
        };

        const totalWorkoutTime = workoutStartTimeRef.current ? Math.floor((Date.now() - workoutStartTimeRef.current) / 1000) : 0;

        // Group stats to just total time per block for beautiful charts
        const blockStats = workoutStats.reduce((acc, stat) => {
            const blockName = stat.block.split(':')[0]; // Use first part, e.g., "Bloque 1"
            acc[blockName] = (acc[blockName] || 0) + stat.duration;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.keys(blockStats).map((key, index) => ({
            name: key,
            value: blockStats[key],
            color: ['#818cf8', '#34d399', '#f472b6', '#fbbf24', '#60a5fa'][index % 5]
        }));

        const handleShare = async () => {
            // Placeholder: since we can't easily capture the screen out-of-the-box,
            // we can prompt the user to take a screen shot, or use Web Share API if text.
            // Ideally we could use html2canvas if available, but for now we format nicely for screenshot.
            alert("Toma una captura de esta pantalla para compartir tu entrenamiento.");
        };

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col h-full bg-zinc-950 overflow-y-auto"
            >
                {/* Header Ticket Style */}
                <div className="bg-gradient-to-br from-indigo-900 to-zinc-900 p-8 rounded-b-[3rem] shadow-2xl relative">
                    <div className="absolute top-6 right-6 flex items-center gap-4">
                        <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md">
                            <Share2 className="w-5 h-5 text-white" />
                        </button>
                        <button onClick={exitToHome} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md">
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <div className="pt-8">
                        <div className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-bold mb-4 border border-indigo-500/30">
                            {selectedDay} • Entrenamiento
                        </div>
                        <h2 className="text-4xl font-black text-white leading-tight mb-6">
                            ¡Completado!
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/5">
                                <div className="text-indigo-200 text-sm font-medium mb-1">Tiempo Total</div>
                                <div className="text-2xl font-black text-white">{formatTime(totalWorkoutTime)}</div>
                            </div>
                            <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/5">
                                <div className="text-indigo-200 text-sm font-medium mb-1">Series Completadas</div>
                                <div className="text-2xl font-black text-white">{workoutStats.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 pb-12">
                    {/* Chart Section */}
                    {chartData.length > 0 && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                            <h3 className="text-lg font-bold text-zinc-300 mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-400" />
                                Tiempo por Bloque
                            </h3>
                            <div className="h-64 mb-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell - ${index} `} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value: number) => formatTime(value)}
                                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '1rem' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Detailed List */}
                    <div>
                        <h3 className="text-lg font-bold text-zinc-400 mb-4 px-2">Desglose por Ejercicio</h3>
                        <div className="space-y-3">
                            {workoutStats.map((stat, idx) => (
                                <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center">
                                    <div className="max-w-[70%]">
                                        <h4 className="text-white font-bold leading-tight truncate">{stat.title}</h4>
                                        <p className="text-zinc-500 text-sm mt-0.5">{stat.seriesInfo}</p>
                                    </div>
                                    <div className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-lg text-sm font-bold tabular-nums">
                                        {formatTime(stat.duration)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={exitToHome}
                        className="mt-8 w-full py-4 bg-white text-black rounded-full font-bold text-lg active:scale-95 transition-transform"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <AnimatePresence mode="wait">
            {screen === 'home' && renderHome()}
            {screen === 'countdown' && renderCountdown()}
            {screen === 'workout' && renderWorkout()}
            {screen === 'done' && renderDone()}
        </AnimatePresence>
    );
}
