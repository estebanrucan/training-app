export type MuscleActivation = {
  name: string;
  percentage: number;
  type: 'primary' | 'secondary';
};

export type ExerciseStep = {
  type: 'exercise';
  title: string;
  reps: string;
  weight?: string;
  notes: string;
  block: string;
  seriesInfo: string;
  muscles?: MuscleActivation[];
};

export type RestStep = {
  type: 'rest';
  duration: number;
  nextExercise?: string;
  phrase?: string;
};

export type WorkoutStep = ExerciseStep | RestStep;

const trenSuperior: WorkoutStep[] = [];
// Bloque 1
for (let i = 1; i <= 3; i++) {
  trenSuperior.push({
    type: 'exercise', title: 'Press de banca inclinado', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Baja contando 3s. Agarre prono. Mantén el pecho alto y las escápulas juntas atrás.', block: 'Bloque 1: Pecho Alto y Espalda', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Pectoral Superior', percentage: 60, type: 'primary' }, { name: 'Deltoides Anterior', percentage: 25, type: 'secondary' }, { name: 'Tríceps', percentage: 15, type: 'secondary' }]
  });
  trenSuperior.push({
    type: 'exercise', title: 'Remo Invertido en TRX', reps: '10 reps', notes: 'Mantén el cuerpo recto como una tabla. Tira hasta que tu pecho toque las manillas. Ajusta la inclinación para mayor dificultad.', block: 'Bloque 1: Pecho Alto y Espalda', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Dorsal Ancho', percentage: 60, type: 'primary' }, { name: 'Trapecio y Romboides', percentage: 30, type: 'secondary' }, { name: 'Bíceps', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Press de banca inclinado', phrase: i === 1 ? 'Buen superset, mantén esa intensidad en el siguiente' : 'Último superset del bloque, ciérralo con todo' });
}
trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Flexiones en TRX', phrase: 'Primer bloque listo, ahora vamos con pecho y espalda media' });

// Bloque 2
for (let i = 1; i <= 3; i++) {
  trenSuperior.push({
    type: 'exercise', title: 'Flexiones en TRX', reps: '8 reps', notes: 'Baja más allá del nivel de tus manos para un estiramiento profundo. Mantén el core firme para evitar arquear la zona lumbar.', block: 'Bloque 2: Pecho Medio y Espalda', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Pectoral Mayor', percentage: 70, type: 'primary' }, { name: 'Tríceps', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 10, type: 'secondary' }]
  });
  trenSuperior.push({
    type: 'exercise', title: 'Remo inclinado con mancuernas', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Espalda recta paralela al suelo. Jala los codos hacia la cadera, sin dar tirones con el torso.', block: 'Bloque 2: Pecho Medio y Espalda', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Trapecio y Romboides', percentage: 70, type: 'primary' }, { name: 'Bíceps', percentage: 20, type: 'secondary' }, { name: 'Erectores Espinales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Flexiones en TRX', phrase: i === 1 ? 'Buen trabajo en el superset, sigue así' : 'Queda un superset más para cerrar este bloque' });
}
trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Curl de Bíceps', phrase: 'Pecho y espalda listos, ahora los brazos para terminar' });

// Bloque 3
for (let i = 1; i <= 3; i++) {
  trenSuperior.push({
    type: 'exercise', title: 'Curl de Bíceps', reps: '6 reps', weight: '2x 11.8 kg', notes: 'Agarre martillo (neutro). Baja en 3s. Mantén los codos fijos a los lados y no balancees el cuerpo.', block: 'Bloque 3: Brazos', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Bíceps', percentage: 60, type: 'primary' }, { name: 'Braquiorradial', percentage: 30, type: 'secondary' }, { name: 'Flexores del Antebrazo', percentage: 10, type: 'secondary' }]
  });
  trenSuperior.push({
    type: 'exercise', title: 'Extensiones de Tríceps en TRX', reps: '10 reps', notes: 'Codos apuntando al frente, lleva las manos hacia tu frente. Extiende contrayendo fuerte el tríceps.', block: 'Bloque 3: Brazos', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Tríceps', percentage: 85, type: 'primary' }, { name: 'Core', percentage: 15, type: 'secondary' }]
  });
  if (i < 3) trenSuperior.push({ type: 'rest', duration: 45, nextExercise: 'Curl de Bíceps', phrase: i === 1 ? 'Primer superset de brazos listo, vamos por el segundo' : 'Último superset de brazos, que se note en cada rep' });
}

const trenInferior1: WorkoutStep[] = [];
// Bloque 1
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla con Mancuernas', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Técnica 1.5 reps: baja, sube mitad, baja de nuevo, sube completo. Mantén el pecho alto.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 1 de 3',
  muscles: [{ name: 'Cuádriceps', percentage: 70, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 10, type: 'secondary' }]
});
trenInferior1.push({ type: 'rest', duration: 120, nextExercise: 'Sentadilla con Mancuernas', phrase: 'Buena primera serie, recupera bien para la segunda' });
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla con Mancuernas', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Enfócate en mantener el peso a los lados y no encorvarte al subir.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 2 de 3',
  muscles: [{ name: 'Cuádriceps', percentage: 70, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 10, type: 'secondary' }]
});
trenInferior1.push({ type: 'rest', duration: 120, nextExercise: 'Sentadilla con Mancuernas', phrase: 'Viene la última serie efectiva, que sea la más limpia' });
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla con Mancuernas', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Última serie efectiva. Mantén el tiempo bajo tensión.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 3 de 3',
  muscles: [{ name: 'Cuádriceps', percentage: 70, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 10, type: 'secondary' }]
});
trenInferior1.push({ type: 'rest', duration: 10, nextExercise: 'Sentadilla con Mancuernas (Fallo)', phrase: 'Ahora sácale todo, hasta que no puedas más' });
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla con Mancuernas', reps: 'Al fallo', weight: '2x 15.3 kg', notes: 'Saca todas las reps extra posibles. Respira profundo, pero no pierdas la postura técnica.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 3 (Extra)',
  muscles: [{ name: 'Cuádriceps', percentage: 80, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 15, type: 'secondary' }]
});

trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Frontales (Izquierda)', phrase: 'Lo más pesado del día ya pasó, ahora estocadas' });

// Bloque 2
for (let i = 1; i <= 3; i++) {
  trenInferior1.push({
    type: 'exercise', title: 'Estocadas Frontales (Izquierda)', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Paso largo izq adelante. Baja vertical, rodilla trasera roza el suelo y empuja desde el talón delantero.', block: 'Bloque 2: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Cuádriceps', percentage: 60, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 30, type: 'secondary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  trenInferior1.push({ type: 'rest', duration: 15, nextExercise: 'Estocadas Frontales (Derecha)', phrase: 'Misma intensidad, ahora la pierna derecha' });
  trenInferior1.push({
    type: 'exercise', title: 'Estocadas Frontales (Derecha)', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Paso largo der adelante. Mantén el torso vertical y empuja fuerte para volver al inicio.', block: 'Bloque 2: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Cuádriceps', percentage: 60, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 30, type: 'secondary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Frontales (Izquierda)', phrase: i === 1 ? 'Primera ronda de estocadas lista, dos más' : 'Una ronda más de estocadas y cerramos este bloque' });
}

trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Peso Muerto Rumano', phrase: 'Estocadas listas, ahora peso muerto rumano para los isquios' });

// Bloque 3
for (let i = 1; i <= 3; i++) {
  trenInferior1.push({
    type: 'exercise', title: 'Peso Muerto Rumano con Mancuernas', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Rodillas semiflexionadas. Tira la cadera atrás estirando isquios. Baja en 3s y sube apretando glúteos.', block: 'Bloque 3: Isquios', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Isquiotibiales', percentage: 65, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 25, type: 'secondary' }, { name: 'Erectores Espinales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Peso Muerto Rumano', phrase: i === 1 ? 'Buena serie, siente cómo trabajan los isquios' : 'Última serie de peso muerto, deja el alma ahí' });
}

trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Elevación de pantorrillas (Izquierda)', phrase: 'Ya hiciste lo más duro, quedan pantorrillas y abdomen' });

// Bloque 4
for (let i = 1; i <= 3; i++) {
  trenInferior1.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Izquierda)', reps: '15 reps', weight: '1x 15.3 kg', notes: 'Sostén la contracción 1s arriba. Baja el talón sintiendo el estiramiento completo. Apoyo pared.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior1.push({ type: 'rest', duration: 15, nextExercise: 'Elevación de pantorrillas (Derecha)', phrase: 'Ahora la otra pantorrilla, mismo ritmo' });
  trenInferior1.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Derecha)', reps: '15 reps', weight: '1x 15.3 kg', notes: 'Sostén la contracción 1s arriba. Baja el talón sintiendo el estiramiento completo. Apoyo pared.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior1.push({ type: 'rest', duration: 15, nextExercise: 'Abdominales con carga', phrase: 'Pantorrillas hechas, cierra con abdominales' });
  trenInferior1.push({
    type: 'exercise', title: 'Abdominales con carga', reps: '15 reps', weight: '1x 15.3 kg', notes: 'Disco o mancuerna al pecho. Enrolla el tronco y contrae fuerte arriba. No tires del cuello.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Recto Abdominal', percentage: 80, type: 'primary' }, { name: 'Oblicuos', percentage: 20, type: 'secondary' }]
  });
  if (i < 3) trenInferior1.push({ type: 'rest', duration: 45, nextExercise: 'Elevación de pantorrillas (Izquierda)', phrase: i === 1 ? 'Primera ronda del circuito final lista' : 'Última ronda, termina el día con todo' });
}

const trenInferior2: WorkoutStep[] = [];
// Bloque 1
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional con Mancuernas', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Desde el suelo. Espalda neutra, empuja el piso con las piernas. Contrae glúteos al subir.', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 1 de 3',
  muscles: [{ name: 'Glúteo Mayor', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 30, type: 'primary' }, { name: 'Erectores Espinales', percentage: 20, type: 'secondary' }]
});
trenInferior2.push({ type: 'rest', duration: 120, nextExercise: 'Peso Muerto Tradicional', phrase: 'Buena primera serie, recupera para mantener la técnica' });
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional con Mancuernas', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Desde el suelo. Mantén las mancuernas pegadas al centro de gravedad.', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 2 de 3',
  muscles: [{ name: 'Glúteo Mayor', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 30, type: 'primary' }, { name: 'Erectores Espinales', percentage: 20, type: 'secondary' }]
});
trenInferior2.push({ type: 'rest', duration: 120, nextExercise: 'Peso Muerto Tradicional con Mancuernas', phrase: 'Viene la última serie efectiva, que la espalda no se curve' });
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional con Mancuernas', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Desde el suelo. Última serie, mantén la concentración en no curvar la espalda baja.', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 3 de 3',
  muscles: [{ name: 'Glúteo Mayor', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 30, type: 'primary' }, { name: 'Erectores Espinales', percentage: 20, type: 'secondary' }]
});
trenInferior2.push({ type: 'rest', duration: 10, nextExercise: 'Peso Muerto Tradicional con Mancuernas', phrase: 'Serie al fallo, saca todas las reps que puedas' });
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional con Mancuernas', reps: 'Al fallo', weight: '2x 15.3 kg', notes: 'Saca las repeticiones extra al fallo técnico (sin perder la postura).', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 3 (Extra)',
  muscles: [{ name: 'Glúteo Mayor', percentage: 45, type: 'primary' }, { name: 'Isquiotibiales', percentage: 35, type: 'primary' }]
});

trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Sentadilla Copa', phrase: 'Peso muerto listo, ahora sentadilla copa' });

// Bloque 2
for (let i = 1; i <= 3; i++) {
  trenInferior2.push({
    type: 'exercise', title: 'Sentadilla Copa', reps: '8 reps', weight: '1x 15.3 kg', notes: 'Mancuerna pegada al pecho. Baja en 3s empujando rodillas hacia afuera y con torso erguido.', block: 'Bloque 2: Sentadilla', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Cuádriceps', percentage: 65, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 15, type: 'secondary' }]
  });
  if (i < 3) trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Sentadilla Copa', phrase: i === 1 ? 'Buena serie de sentadilla copa, mantén la profundidad' : 'Última serie de copa, baja profundo y con control' });
}

trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Inversas (Izquierda)', phrase: 'Sentadillas listas, ahora estocadas inversas' });

// Bloque 3
for (let i = 1; i <= 3; i++) {
  trenInferior2.push({
    type: 'exercise', title: 'Estocadas Inversas (Izquierda)', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Paso largo atrás con pierna izq. Carga peso en el talón de la pierna delantera.', block: 'Bloque 3: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Glúteo Mayor', percentage: 50, type: 'primary' }, { name: 'Cuádriceps', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  trenInferior2.push({ type: 'rest', duration: 15, nextExercise: 'Estocadas Inversas (Derecha)', phrase: 'Misma fuerza, ahora la pierna derecha' });
  trenInferior2.push({
    type: 'exercise', title: 'Estocadas Inversas (Derecha)', reps: '8 reps', weight: '2x 15.3 kg', notes: 'Paso largo atrás con pierna der. Mantén abdomen firme para no perder equilibrio.', block: 'Bloque 3: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Glúteo Mayor', percentage: 50, type: 'primary' }, { name: 'Cuádriceps', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Inversas (Izquierda)', phrase: i === 1 ? 'Primera ronda de estocadas inversas hecha' : 'Última ronda de estocadas, deja todo' });
}

trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Elevación de pantorrillas (Izquierda)', phrase: 'Lo más pesado ya pasó, queda el circuito final' });

// Bloque 4
for (let i = 1; i <= 3; i++) {
  trenInferior2.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Izquierda)', reps: '15 reps', weight: '1x 15.3 kg', notes: 'Apoyo en pared. Contrae al máximo arriba (1s) y estira completo al bajar.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior2.push({ type: 'rest', duration: 15, nextExercise: 'Elevación de pantorrillas (Derecha)', phrase: 'Ahora la otra pantorrilla, mismo ritmo' });
  trenInferior2.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Derecha)', reps: '15 reps', weight: '1x 15.3 kg', notes: 'Apoyo en pared. Contrae al máximo arriba (1s) y estira completo al bajar.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior2.push({ type: 'rest', duration: 15, nextExercise: 'Abdominales con carga', phrase: 'Pantorrillas listas, cierra con abdominales' });
  trenInferior2.push({
    type: 'exercise', title: 'Abdominales con carga', reps: '15 reps', weight: '1x 15.3 kg', notes: 'Mancuerna al pecho. Flexiona la columna para contraer el abdomen, sin tirones.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Recto Abdominal', percentage: 80, type: 'primary' }, { name: 'Oblicuos', percentage: 20, type: 'secondary' }]
  });
  if (i < 3) trenInferior2.push({ type: 'rest', duration: 45, nextExercise: 'Elevación de pantorrillas (Izquierda)', phrase: i === 1 ? 'Primera ronda del circuito final completa' : 'Última ronda, cierra el entrenamiento con fuerza' });
}

export const routines: Record<string, WorkoutStep[]> = {
  Lunes: trenSuperior,
  Martes: trenInferior1,
  Jueves: trenSuperior,
  Viernes: trenInferior2,
};
