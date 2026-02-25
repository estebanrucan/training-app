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
};

export type WorkoutStep = ExerciseStep | RestStep;

const trenSuperior: WorkoutStep[] = [];
// Bloque 1
for (let i = 1; i <= 3; i++) {
  trenSuperior.push({
    type: 'exercise', title: 'Press de banca inclinado', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Baja contando 3s. Agarre prono. Mantén el pecho alto y las escápulas juntas atrás.', block: 'Bloque 1: Pecho Alto y Espalda', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Pectoral Superior', percentage: 60, type: 'primary' }, { name: 'Deltoides Anterior', percentage: 25, type: 'secondary' }, { name: 'Tríceps', percentage: 15, type: 'secondary' }]
  });
  trenSuperior.push({
    type: 'exercise', title: 'Jalón al pecho', reps: '10 reps', weight: '20 kg', notes: 'Agarre prono. Baja controladamente. Inicia el jalón desde los codos y aprieta la espalda al final.', block: 'Bloque 1: Pecho Alto y Espalda', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Dorsal Ancho', percentage: 70, type: 'primary' }, { name: 'Bíceps', percentage: 20, type: 'secondary' }, { name: 'Flexores del Antebrazo', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Press de banca inclinado' });
}
trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Flexiones de pecho planas' });

// Bloque 2
for (let i = 1; i <= 3; i++) {
  trenSuperior.push({
    type: 'exercise', title: 'Flexiones de pecho planas', reps: '7 reps', notes: 'Baja en 3s. Mantén el cuerpo en línea recta y el abdomen firme, sin hundir la cadera.', block: 'Bloque 2: Pecho Medio y Espalda', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Pectoral Mayor', percentage: 65, type: 'primary' }, { name: 'Tríceps', percentage: 25, type: 'secondary' }, { name: 'Deltoides Anterior', percentage: 10, type: 'secondary' }]
  });
  trenSuperior.push({
    type: 'exercise', title: 'Remo inclinado con mancuernas', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Espalda recta paralela al suelo. Jala los codos hacia la cadera, sin dar tirones con el torso.', block: 'Bloque 2: Pecho Medio y Espalda', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Trapecio y Romboides', percentage: 70, type: 'primary' }, { name: 'Bíceps', percentage: 20, type: 'secondary' }, { name: 'Erectores Espinales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Flexiones de pecho planas' });
}
trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Curl de Bíceps' });

// Bloque 3
for (let i = 1; i <= 3; i++) {
  trenSuperior.push({
    type: 'exercise', title: 'Curl de Bíceps', reps: '10 reps', weight: '2x 9.3 kg', notes: 'Agarre martillo (neutro). Baja en 3s. Mantén los codos fijos a los lados y no balancees el cuerpo.', block: 'Bloque 3: Brazos', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Bíceps', percentage: 60, type: 'primary' }, { name: 'Braquiorradial', percentage: 30, type: 'secondary' }, { name: 'Flexores del Antebrazo', percentage: 10, type: 'secondary' }]
  });
  trenSuperior.push({
    type: 'exercise', title: 'Flexiones de codo en diagonal', reps: '7 reps', notes: 'Enfoque en tríceps. Mantén los codos cerrados y rozando tus costillas al bajar.', block: 'Bloque 3: Brazos', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Tríceps', percentage: 80, type: 'primary' }, { name: 'Pectoral Mayor', percentage: 10, type: 'secondary' }, { name: 'Deltoides Anterior', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenSuperior.push({ type: 'rest', duration: 45, nextExercise: 'Curl de Bíceps' });
}

const trenInferior1: WorkoutStep[] = [];
// Bloque 1
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla con Mancuernas (1.5 Reps)', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Técnica 1.5 reps: baja, sube mitad, baja de nuevo, sube completo. Mantén el pecho alto.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 1 de 3',
  muscles: [{ name: 'Cuádriceps', percentage: 70, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 10, type: 'secondary' }]
});
trenInferior1.push({ type: 'rest', duration: 120, nextExercise: 'Sentadilla con Mancuernas' });
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla con Mancuernas (1.5 Reps)', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Enfócate en mantener el peso a los lados y no encorvarte al subir.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 2 de 3',
  muscles: [{ name: 'Cuádriceps', percentage: 70, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 10, type: 'secondary' }]
});
trenInferior1.push({ type: 'rest', duration: 120, nextExercise: 'Sentadilla con Mancuernas' });
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla con Mancuernas (1.5 Reps)', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Última serie efectiva. Mantén el tiempo bajo tensión.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 3 de 3',
  muscles: [{ name: 'Cuádriceps', percentage: 70, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 10, type: 'secondary' }]
});
trenInferior1.push({ type: 'rest', duration: 10, nextExercise: 'Sentadilla con Mancuernas (Fallo)' });
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla con Mancuernas (Rest-Pause)', reps: 'Al fallo', weight: '2x 13.3 kg', notes: 'Saca todas las reps extra posibles. Respira profundo, pero no pierdas la postura técnica.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 3 (Extra)',
  muscles: [{ name: 'Cuádriceps', percentage: 80, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 15, type: 'secondary' }]
});

trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Frontales (Izquierda)' });

// Bloque 2
for (let i = 1; i <= 3; i++) {
  trenInferior1.push({
    type: 'exercise', title: 'Estocadas Frontales (Izquierda)', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Paso largo izq adelante. Baja vertical, rodilla trasera roza el suelo y empuja desde el talón delantero.', block: 'Bloque 2: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Cuádriceps', percentage: 60, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 30, type: 'secondary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  trenInferior1.push({ type: 'rest', duration: 15, nextExercise: 'Estocadas Frontales (Derecha)' });
  trenInferior1.push({
    type: 'exercise', title: 'Estocadas Frontales (Derecha)', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Paso largo der adelante. Mantén el torso vertical y empuja fuerte para volver al inicio.', block: 'Bloque 2: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Cuádriceps', percentage: 60, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 30, type: 'secondary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Frontales (Izquierda)' });
}

trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Peso Muerto Rumano' });

// Bloque 3
for (let i = 1; i <= 3; i++) {
  trenInferior1.push({
    type: 'exercise', title: 'Peso Muerto Rumano con Mancuernas', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Rodillas semiflexionadas. Tira la cadera atrás estirando isquios. Baja en 3s y sube apretando glúteos.', block: 'Bloque 3: Isquios', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Isquiotibiales', percentage: 65, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 25, type: 'secondary' }, { name: 'Erectores Espinales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Peso Muerto Rumano' });
}

trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Elevación de pantorrillas (Izquierda)' });

// Bloque 4
for (let i = 1; i <= 3; i++) {
  trenInferior1.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Izquierda)', reps: '15 reps', weight: '1x 13.3 kg', notes: 'Sostén la contracción 1s arriba. Baja el talón sintiendo el estiramiento completo. Apoyo pared.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior1.push({ type: 'rest', duration: 15, nextExercise: 'Elevación de pantorrillas (Derecha)' });
  trenInferior1.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Derecha)', reps: '15 reps', weight: '1x 13.3 kg', notes: 'Sostén la contracción 1s arriba. Baja el talón sintiendo el estiramiento completo. Apoyo pared.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior1.push({ type: 'rest', duration: 15, nextExercise: 'Abdominales con carga' });
  trenInferior1.push({
    type: 'exercise', title: 'Abdominales con carga', reps: '15 reps', weight: '1x 13.3 kg', notes: 'Disco o mancuerna al pecho. Enrolla el tronco y contrae fuerte arriba. No tires del cuello.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Recto Abdominal', percentage: 80, type: 'primary' }, { name: 'Oblicuos', percentage: 20, type: 'secondary' }]
  });
  if (i < 3) trenInferior1.push({ type: 'rest', duration: 45, nextExercise: 'Elevación de pantorrillas (Izquierda)' });
}

const trenInferior2: WorkoutStep[] = [];
// Bloque 1
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional con Mancuernas', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Desde el suelo. Espalda neutra, empuja el piso con las piernas. Contrae glúteos al subir.', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 1 de 3',
  muscles: [{ name: 'Glúteo Mayor', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 30, type: 'primary' }, { name: 'Erectores Espinales', percentage: 20, type: 'secondary' }]
});
trenInferior2.push({ type: 'rest', duration: 120, nextExercise: 'Peso Muerto Tradicional' });
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional con Mancuernas', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Desde el suelo. Mantén las mancuernas pegadas al centro de gravedad.', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 2 de 3',
  muscles: [{ name: 'Glúteo Mayor', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 30, type: 'primary' }, { name: 'Erectores Espinales', percentage: 20, type: 'secondary' }]
});
trenInferior2.push({ type: 'rest', duration: 120, nextExercise: 'Peso Muerto Tradicional (Al límite)' });
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional con Mancuernas', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Desde el suelo. Última serie, mantén la concentración en no curvar la espalda baja.', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 3 de 3',
  muscles: [{ name: 'Glúteo Mayor', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 30, type: 'primary' }, { name: 'Erectores Espinales', percentage: 20, type: 'secondary' }]
});
trenInferior2.push({ type: 'rest', duration: 10, nextExercise: 'Peso Muerto Tradicional (Fallo)' });
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional (Rest-Pause)', reps: 'Al fallo', weight: '2x 13.3 kg', notes: 'Saca las repeticiones extra al fallo técnico (sin perder la postura).', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 3 (Extra)',
  muscles: [{ name: 'Glúteo Mayor', percentage: 45, type: 'primary' }, { name: 'Isquiotibiales', percentage: 35, type: 'primary' }]
});

trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Sentadilla Copa' });

// Bloque 2
for (let i = 1; i <= 3; i++) {
  trenInferior2.push({
    type: 'exercise', title: 'Sentadilla Copa', reps: '10 reps', weight: '1x 13.3 kg', notes: 'Mancuerna pegada al pecho. Baja en 3s empujando rodillas hacia afuera y con torso erguido.', block: 'Bloque 2: Sentadilla', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Cuádriceps', percentage: 65, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 15, type: 'secondary' }]
  });
  if (i < 3) trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Sentadilla Copa' });
}

trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Inversas (Izquierda)' });

// Bloque 3
for (let i = 1; i <= 3; i++) {
  trenInferior2.push({
    type: 'exercise', title: 'Estocadas Inversas (Izquierda)', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Paso largo atrás con pierna izq. Carga peso en el talón de la pierna delantera.', block: 'Bloque 3: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Glúteo Mayor', percentage: 50, type: 'primary' }, { name: 'Cuádriceps', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  trenInferior2.push({ type: 'rest', duration: 15, nextExercise: 'Estocadas Inversas (Derecha)' });
  trenInferior2.push({
    type: 'exercise', title: 'Estocadas Inversas (Derecha)', reps: '10 reps', weight: '2x 13.3 kg', notes: 'Paso largo atrás con pierna der. Mantén abdomen firme para no perder equilibrio.', block: 'Bloque 3: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Glúteo Mayor', percentage: 50, type: 'primary' }, { name: 'Cuádriceps', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Inversas (Izquierda)' });
}

trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Elevación de pantorrillas (Izquierda)' });

// Bloque 4
for (let i = 1; i <= 3; i++) {
  trenInferior2.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Izquierda)', reps: '15 reps', weight: '1x 13.3 kg', notes: 'Apoyo en pared. Contrae al máximo arriba (1s) y estira completo al bajar.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior2.push({ type: 'rest', duration: 15, nextExercise: 'Elevación de pantorrillas (Derecha)' });
  trenInferior2.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Derecha)', reps: '15 reps', weight: '1x 13.3 kg', notes: 'Apoyo en pared. Contrae al máximo arriba (1s) y estira completo al bajar.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior2.push({ type: 'rest', duration: 15, nextExercise: 'Abdominales con carga' });
  trenInferior2.push({
    type: 'exercise', title: 'Abdominales con carga', reps: '15 reps', weight: '1x 13.3 kg', notes: 'Mancuerna al pecho. Flexiona la columna para contraer el abdomen, sin tirones.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Recto Abdominal', percentage: 80, type: 'primary' }, { name: 'Oblicuos', percentage: 20, type: 'secondary' }]
  });
  if (i < 3) trenInferior2.push({ type: 'rest', duration: 45, nextExercise: 'Elevación de pantorrillas (Izquierda)' });
}

export const routines: Record<string, WorkoutStep[]> = {
  Lunes: trenSuperior,
  Martes: trenInferior1,
  Jueves: trenSuperior,
  Viernes: trenInferior2,
};
