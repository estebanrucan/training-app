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
    type: 'exercise', title: 'Press Inclinado', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: i === 1 ? 'Vamos a despertar ese pectoral superior. Baja contando 3s, escápulas juntas atrás y pecho bien alto. Que se sienta desde la primera rep.' : i === 2 ? 'Ese pectoral ya está caliente, ahora aprieta más arriba. Agarre prono, codos a 45° y no pierdas la tensión al bajar.' : 'Última serie, que ese pecho quede reventado. Cada rep cuenta, baja lento y empuja con todo. Tú puedes.', block: 'Bloque 1: Pecho Alto y Espalda Vertical', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Pectoral Superior', percentage: 60, type: 'primary' }, { name: 'Deltoides Anterior', percentage: 25, type: 'secondary' }, { name: 'Tríceps', percentage: 15, type: 'secondary' }]
  });
  trenSuperior.push({
    type: 'exercise', title: 'Jalón Vertical en TRX', reps: '10 reps', weight: 'TRX | Peso corporal', notes: i === 1 ? 'Hora de sacar esas alas. Ancla el TRX alto, siéntate debajo y jala clavando los codos hacia el suelo. Siente cómo se abre ese dorsal desde la primera rep.' : i === 2 ? 'Esa espalda en V se construye aquí. Estira completo arriba y jala con todo hacia abajo. No uses vuelo, puro poder de tu espalda.' : 'Último jalón del bloque, deja esa espalda gigante y reventada. Aprieta abajo como si quisieras romper las cintas. Dale.', block: 'Bloque 1: Pecho Alto y Espalda Vertical', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Dorsal Ancho', percentage: 70, type: 'primary' }, { name: 'Bíceps', percentage: 15, type: 'secondary' }, { name: 'Redondo Mayor', percentage: 15, type: 'secondary' }]
  });
  if (i < 3) trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Press Inclinado', phrase: i === 1 ? 'Buen superset, ¡ese pecho y esa espalda ya están bombeados! Sacude los brazos y vamos por el siguiente.' : 'Último superset del bloque. Respira profundo, que esta va con todo. Quiero verte apretar cada rep.' });
}
trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Flexiones Agarre Vertical', phrase: 'Primer bloque destruido 💪 Ese pectoral superior y esos dorsales ya están a fuego. Ahora vamos por el pecho medio y el grosor de la espalda.' });

// Bloque 2
for (let i = 1; i <= 3; i++) {
  trenSuperior.push({
    type: 'exercise', title: 'Flexiones Agarre Vertical', reps: '8 reps', weight: 'Peso corporal | 46 kg', notes: i === 1 ? 'Agarre neutro, baja el pecho entre las manos contando 3s. Core firme y codos pegados al torso. Que ese pectoral medio se llene de sangre.' : i === 2 ? 'Ya lo sientes, ¿no? Ese pecho está trabajando duro. Mantén los codos cerca, baja controlado y empuja explosivo.' : 'Última serie de flexiones, que ese pecho quede bombeado. No me sueltes la técnica, codos pegados hasta la última rep.', block: 'Bloque 2: Pecho Medio y Espalda', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Pectoral Mayor', percentage: 55, type: 'primary' }, { name: 'Tríceps', percentage: 30, type: 'secondary' }, { name: 'Core', percentage: 15, type: 'secondary' }]
  });
  trenSuperior.push({
    type: 'exercise', title: 'Remo Inclinado', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: i === 1 ? 'Espalda recta, paralela al suelo. Jala los codos hacia la cadera, sin tirones. Siente cómo se aprieta la espalda media.' : i === 2 ? 'Esos romboides y trapecios están on fire. Mantén la posición, no te levantes. Jala lento y aprieta arriba.' : 'Último remo inclinado. Esa espalda está quedando como tabla. Dale con todo, que cada jalón cuente.', block: 'Bloque 2: Pecho Medio y Espalda', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Trapecio y Romboides', percentage: 70, type: 'primary' }, { name: 'Bíceps', percentage: 20, type: 'secondary' }, { name: 'Erectores Espinales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Flexiones Agarre Vertical', phrase: i === 1 ? 'Buen trabajo, ese pecho se está marcando. Suelta los brazos, respira y vamos por el siguiente superset.' : 'Queda un superset para cerrar este bloque. Esa espalda y ese pecho van a quedar espectaculares, dale.' });
}
trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Extensiones de Tríceps', phrase: '¡Pecho y espalda listos! Ahora viene el remate de brazos y hombros. Vamos a aislar y reventar lo que queda.' });

// Bloque 3
for (let i = 1; i <= 3; i++) {
  trenSuperior.push({
    type: 'exercise', title: 'Extensiones de Tríceps', reps: '10 reps', weight: 'TRX | 28 kg', notes: i === 1 ? 'Codos apuntando al frente, manos hacia tu frente. Extiende apretando fuerte el tríceps. Que esa herradura se marque desde ahora.' : i === 2 ? 'Ese tríceps ya está ardiendo, ¿lo sientes? Bien, eso es que está creciendo. Mantén los codos fijos y empuja con todo.' : 'Último set de tríceps, que esos brazos queden hinchados. Contrae al máximo en cada extensión, no aflojes la técnica.', block: 'Bloque 3: Brazos y Hombros', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Tríceps', percentage: 85, type: 'primary' }, { name: 'Core', percentage: 15, type: 'secondary' }]
  });
  trenSuperior.push({
    type: 'exercise', title: 'Elevaciones Laterales', reps: '15 reps', weight: 'Mancuernas | 2x 5.3 kg', notes: i === 1 ? 'Eleva hasta la altura de hombros, codos ligeramente flexionados. Baja en 3s. Que esos deltoides se redondeen.' : i === 2 ? 'Esos hombros se están poniendo anchos. No balancees el torso, deja que el deltoides haga el trabajo. Controla la bajada.' : 'Últimas laterales, que esos hombros queden como bolas. Aprieta arriba y baja lento, siente cada fibra arder.', block: 'Bloque 3: Brazos y Hombros', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Deltoides Lateral', percentage: 75, type: 'primary' }, { name: 'Trapecio Superior', percentage: 15, type: 'secondary' }, { name: 'Deltoides Anterior', percentage: 10, type: 'secondary' }]
  });
  trenSuperior.push({
    type: 'exercise', title: 'Curl de Bíceps', reps: '6 reps', weight: 'Mancuernas | 2x 11.8 kg', notes: i === 1 ? 'El agarre ya descansó, ahora a exigir esos bíceps. Agarre martillo, baja en 3s. Codos fijos a los lados, sin balancear.' : i === 2 ? 'Esos brazos se están poniendo más grandes. No balancees, que el bíceps haga TODO el trabajo ahora que está fresco. Aprieta arriba.' : 'Última serie de curl y de toda la rutina. Para que esos brazos se vean enormes. Cada rep lenta, cada contracción al máximo. Cierra fuerte.', block: 'Bloque 3: Brazos y Hombros', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Bíceps', percentage: 60, type: 'primary' }, { name: 'Braquiorradial', percentage: 30, type: 'secondary' }, { name: 'Flexores del Antebrazo', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenSuperior.push({ type: 'rest', duration: 60, nextExercise: 'Extensiones de Tríceps', phrase: i === 1 ? 'Primer tri-set hecho, esos brazos ya se ven más llenos. Sacude las manos y vamos por el segundo.' : 'Último tri-set, que esos brazos y hombros queden reventados. Quiero verte apretar cada rep como si fuera competencia.' });
}


const trenInferior1: WorkoutStep[] = [];
// Bloque 1
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: 'Técnica 1.5 reps: baja, sube mitad, baja de nuevo, sube completo. Pecho alto y esos cuádriceps van a arder desde la primera. Vamos a construir piernas de acero.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 1 de 3',
  muscles: [{ name: 'Cuádriceps', percentage: 70, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 10, type: 'secondary' }]
});
trenInferior1.push({ type: 'rest', duration: 120, nextExercise: 'Sentadilla', phrase: 'Buena primera serie, esos cuádriceps ya están calientes. Respira profundo, sacude las piernas y prepárate para la segunda.' });
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: 'Mancuernas a los lados, no te encorves al subir. Esos cuádriceps ya están activados, ahora mantén la tensión en cada rep. Tú mandas el peso, no al revés.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 2 de 3',
  muscles: [{ name: 'Cuádriceps', percentage: 70, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 10, type: 'secondary' }]
});
trenInferior1.push({ type: 'rest', duration: 120, nextExercise: 'Sentadilla', phrase: 'Viene la última serie efectiva. Quiero que sea la más limpia de las tres. Esas piernas van a quedar como rocas.' });
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: 'Última serie efectiva. Esos cuádriceps están que arden y eso está perfecto. Mantén el tiempo bajo tensión, no apures. Cada segundo cuenta.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 3 de 3',
  muscles: [{ name: 'Cuádriceps', percentage: 70, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 10, type: 'secondary' }]
});
trenInferior1.push({ type: 'rest', duration: 10, nextExercise: 'Sentadilla (Fallo)', phrase: 'Ahora sácale todo lo que queda. Hasta que esas piernas digan basta. ¡Vamos!' });
trenInferior1.push({
  type: 'exercise', title: 'Sentadilla', reps: 'Al fallo', weight: 'Mancuernas | 2x 15.3 kg', notes: 'Todo lo que tengas, déjalo aquí. Respira profundo entre reps, pero no pierdas la postura. Cuando sientas que no puedes, dame una más. Esos cuádriceps van a crecer.', block: 'Bloque 1: Cuádriceps', seriesInfo: 'Serie 3 (Extra)',
  muscles: [{ name: 'Cuádriceps', percentage: 80, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 15, type: 'secondary' }]
});

trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Frontales (Izquierda)', phrase: 'Lo más pesado del día ya lo hiciste, crack. Esos cuádriceps están destruidos. Ahora estocadas para esculpir cada pierna.' });

// Bloque 2
for (let i = 1; i <= 3; i++) {
  trenInferior1.push({
    type: 'exercise', title: 'Estocadas Frontales (Izquierda)', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: i === 1 ? 'Paso largo con la izquierda. Baja vertical, rodilla trasera roza el suelo. Empuja desde el talón, siente ese glúteo y cuádriceps trabajando juntos.' : i === 2 ? 'Segunda ronda, esa pierna izquierda ya la sientes, ¿no? Bien, mantén el torso recto y empuja con fuerza desde abajo.' : 'Última ronda con la izquierda. Que esa pierna quede marcada. Baja profundo y empuja como si el suelo te debiera algo.', block: 'Bloque 2: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Cuádriceps', percentage: 60, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 30, type: 'secondary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  trenInferior1.push({ type: 'rest', duration: 15, nextExercise: 'Estocadas Frontales (Derecha)', phrase: 'Misma intensidad, ahora la derecha. Que las dos piernas queden iguales de fuertes.' });
  trenInferior1.push({
    type: 'exercise', title: 'Estocadas Frontales (Derecha)', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: i === 1 ? 'Paso largo con la derecha. Torso vertical, empuja fuerte desde el talón. No dejes que la rodilla se vaya hacia adentro.' : i === 2 ? 'Esa pierna derecha también tiene que quedar igual de fuerte. Controla el descenso y explota al subir.' : 'Última con la derecha. Dale con todo, que esas piernas se vean simétricas y poderosas. Cada paso cuenta.', block: 'Bloque 2: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Cuádriceps', percentage: 60, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 30, type: 'secondary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Frontales (Izquierda)', phrase: i === 1 ? 'Primera ronda de estocadas lista. Sacude las piernas, que vienen dos rondas más para dejarlas de acero.' : 'Una ronda más y cerramos estocadas. Esas piernas van a agradecer esto mañana... o pasado 😅' });
}

trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Peso Muerto Rumano', phrase: 'Estocadas listas, piernas en llamas. Ahora peso muerto rumano para esos isquios. Siente el estiramiento.' });

// Bloque 3
for (let i = 1; i <= 3; i++) {
  trenInferior1.push({
    type: 'exercise', title: 'Peso Muerto Rumano', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: i === 1 ? 'Rodillas semiflexionadas, cadera atrás estirando isquios. Baja en 3s y sube apretando fuerte los glúteos. Esa cadena posterior se va a poner de acero.' : i === 2 ? '¿Sientes esos isquios estirarse? Así es como crecen. Mantén la espalda neutra y no apures la bajada. Control total.' : 'Última serie de peso muerto. Deja el alma en estos isquios. Baja lento, sube apretando glúteos. Esa parte trasera del muslo va a quedar brutal.', block: 'Bloque 3: Isquios', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Isquiotibiales', percentage: 65, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 25, type: 'secondary' }, { name: 'Erectores Espinales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Peso Muerto Rumano', phrase: i === 1 ? 'Buena serie, esos isquios ya lo están sintiendo. Estira suave las piernas y vamos por la segunda.' : 'Última serie de peso muerto rumano, deja esos isquios reventados. Todo lo que tienes, aquí.' });
}

trenInferior1.push({ type: 'rest', duration: 90, nextExercise: 'Elevación de pantorrillas (Izquierda)', phrase: 'Ya hiciste lo más duro del día, máquina. Quedan pantorrillas y abdomen para cerrar con todo.' });

// Bloque 4
for (let i = 1; i <= 3; i++) {
  trenInferior1.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Izquierda)', reps: '15 reps', weight: 'Mancuerna | 1x 15.3 kg', notes: i === 1 ? 'Contrae al máximo arriba 1 segundo y baja estirando completo. Esas pantorrillas se van a marcar con cada rep. Apóyate en la pared.' : i === 2 ? 'Esa pantorrilla izquierda ya arde, eso es progreso. Misma calidad, misma contracción arriba. No te apures.' : 'Última serie, que esa pantorrilla quede inflada. Aprieta fuerte arriba, estira completo abajo. Cada rep es ganancia.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior1.push({ type: 'rest', duration: 15, nextExercise: 'Elevación de pantorrillas (Derecha)', phrase: 'Ahora la otra pantorrilla. Mismo ritmo, misma intensidad. Que las dos queden iguales.' });
  trenInferior1.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Derecha)', reps: '15 reps', weight: 'Mancuerna | 1x 15.3 kg', notes: i === 1 ? 'Misma calidad que la izquierda. Contrae 1s arriba y estira completo. Esas pantorrillas se van a ver brutales.' : i === 2 ? 'Esa pantorrilla derecha tiene que quedar igual de trabajada. Aprieta, sostén, baja lento.' : 'Última con la derecha, dale con ganas. Que esos gemelos queden como piedras.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior1.push({ type: 'rest', duration: 15, nextExercise: 'Abdominales', phrase: 'Pantorrillas hechas, ahora a cerrar con abdominales. Que ese core quede duro como tabla.' });
  trenInferior1.push({
    type: 'exercise', title: 'Abdominales', reps: '15 reps', weight: 'Mancuerna | 1x 15.3 kg', notes: i === 1 ? 'Mancuerna al pecho, enrolla el tronco y contrae fuerte arriba. No tires del cuello. Siente cómo se aprieta ese abdomen.' : i === 2 ? 'Ese six-pack no se hace solo. Enrolla la columna, aprieta fuerte arriba, baja controlado. Tú puedes.' : 'Últimos abdominales del día. Todo lo que queda, déjalo aquí. Cada contracción te acerca a ese abdomen marcado.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Recto Abdominal', percentage: 80, type: 'primary' }, { name: 'Oblicuos', percentage: 20, type: 'secondary' }]
  });
  if (i < 3) trenInferior1.push({ type: 'rest', duration: 45, nextExercise: 'Elevación de pantorrillas (Izquierda)', phrase: i === 1 ? 'Primera ronda del circuito final completada. Mueve las piernas, respira y vamos por la segunda.' : 'Última ronda, cierra este día como un campeón. Todo el esfuerzo vale la pena, confía en el proceso.' });
}

const trenInferior2: WorkoutStep[] = [];
// Bloque 1
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: 'Desde el suelo, espalda neutra. Empuja el piso con las piernas y contrae glúteos al subir. Vamos a construir una cadena posterior de hierro.', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 1 de 3',
  muscles: [{ name: 'Glúteo Mayor', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 30, type: 'primary' }, { name: 'Erectores Espinales', percentage: 20, type: 'secondary' }]
});
trenInferior2.push({ type: 'rest', duration: 120, nextExercise: 'Peso Muerto Tradicional', phrase: 'Buena primera serie, esos glúteos e isquios ya están activados. Respira profundo, estira la espalda y vamos por la segunda.' });
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: 'Mantén las mancuernas pegadas al centro de gravedad. Esa espalda no se curva, tú controlas el peso. Glúteos e isquios hacen el trabajo.', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 2 de 3',
  muscles: [{ name: 'Glúteo Mayor', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 30, type: 'primary' }, { name: 'Erectores Espinales', percentage: 20, type: 'secondary' }]
});
trenInferior2.push({ type: 'rest', duration: 120, nextExercise: 'Peso Muerto Tradicional', phrase: 'Viene la última serie efectiva. Ojo con la espalda, que se mantenga neutra. Esos glúteos van a quedar de acero.' });
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: 'Última serie, concentración máxima. La espalda baja no se curva por nada del mundo. Aprieta los glúteos arriba como si tu vida dependiera de ello.', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 3 de 3',
  muscles: [{ name: 'Glúteo Mayor', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 30, type: 'primary' }, { name: 'Erectores Espinales', percentage: 20, type: 'secondary' }]
});
trenInferior2.push({ type: 'rest', duration: 10, nextExercise: 'Peso Muerto Tradicional', phrase: 'Serie al fallo, saca todas las reps que puedas. Esa cadena posterior va a quedar brutal.' });
trenInferior2.push({
  type: 'exercise', title: 'Peso Muerto Tradicional', reps: 'Al fallo', weight: 'Mancuernas | 2x 15.3 kg', notes: 'Todo lo que queda, aquí. Cada rep extra es ganancia pura. Mantén la postura, respira entre reps. Cuando creas que no puedes, dame una más.', block: 'Bloque 1: Cadena Posterior', seriesInfo: 'Serie 3 (Extra)',
  muscles: [{ name: 'Glúteo Mayor', percentage: 45, type: 'primary' }, { name: 'Isquiotibiales', percentage: 35, type: 'primary' }]
});

trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Sentadilla Copa', phrase: 'Peso muerto destruido. Esos glúteos e isquios están en llamas. Ahora sentadilla copa para esos cuádriceps.' });

// Bloque 2
for (let i = 1; i <= 3; i++) {
  trenInferior2.push({
    type: 'exercise', title: 'Sentadilla Copa', reps: '8 reps', weight: 'Mancuerna | 1x 15.3 kg', notes: i === 1 ? 'Mancuerna pegada al pecho, baja en 3s empujando rodillas afuera. Torso erguido. Esos cuádriceps van a sentir cada segundo de tensión.' : i === 2 ? 'Segunda serie, esas piernas ya están calientes. Baja profundo, que las rodillas vayan afuera. El core firme te mantiene recto.' : 'Última copa, baja lo más profundo que puedas con control. Esos cuádriceps están que arden y eso es exactamente lo que queremos.', block: 'Bloque 2: Sentadilla', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Cuádriceps', percentage: 65, type: 'primary' }, { name: 'Glúteo Mayor', percentage: 20, type: 'secondary' }, { name: 'Core', percentage: 15, type: 'secondary' }]
  });
  if (i < 3) trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Sentadilla Copa', phrase: i === 1 ? 'Buena serie, mantén esa profundidad. Mueve las piernas, respira y vamos por la segunda.' : 'Última serie de copa, baja profundo y con control. Esos muslos van a quedar marcados.' });
}

trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Inversas (Izquierda)', phrase: 'Sentadillas listas, piernas bien trabajadas. Ahora estocadas inversas para esculpir cada pierna por separado.' });

// Bloque 3
for (let i = 1; i <= 3; i++) {
  trenInferior2.push({
    type: 'exercise', title: 'Estocadas Inversas (Izquierda)', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: i === 1 ? 'Paso largo atrás con la izquierda. Carga el peso en el talón delantero. Siente cómo ese glúteo y cuádriceps trabajan juntos.' : i === 2 ? 'Esa pierna izquierda ya la sientes, bien. Mantén el equilibrio y empuja fuerte desde el talón. El abdomen firme te estabiliza.' : 'Últimas estocadas con la izquierda. Que ese glúteo y cuádriceps queden destruidos. Baja profundo, sube con potencia.', block: 'Bloque 3: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Glúteo Mayor', percentage: 50, type: 'primary' }, { name: 'Cuádriceps', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  trenInferior2.push({ type: 'rest', duration: 15, nextExercise: 'Estocadas Inversas (Derecha)', phrase: 'Misma fuerza con la derecha. Que las dos piernas queden parejas y fuertes.' });
  trenInferior2.push({
    type: 'exercise', title: 'Estocadas Inversas (Derecha)', reps: '8 reps', weight: 'Mancuernas | 2x 15.3 kg', notes: i === 1 ? 'Paso largo atrás con la derecha. Abdomen firme para no perder el equilibrio. Empuja desde el talón, siente el glúteo apretar.' : i === 2 ? 'Esa pierna derecha también tiene que quedar igual de trabajada. Control en la bajada, explosión al subir.' : 'Últimas con la derecha. Todo lo que tienes, déjalo en estas reps. Esas piernas van a verse espectaculares.', block: 'Bloque 3: Estocadas', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Glúteo Mayor', percentage: 50, type: 'primary' }, { name: 'Cuádriceps', percentage: 40, type: 'primary' }, { name: 'Isquiotibiales', percentage: 10, type: 'secondary' }]
  });
  if (i < 3) trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Estocadas Inversas (Izquierda)', phrase: i === 1 ? 'Primera ronda de estocadas inversas hecha. Esas piernas están trabajando duro, se nota.' : 'Última ronda de estocadas, deja todo en la cancha. Cada paso te hace más fuerte.' });
}

trenInferior2.push({ type: 'rest', duration: 90, nextExercise: 'Elevación de pantorrillas (Izquierda)', phrase: 'Lo más pesado ya pasó, crack. Queda el circuito final: pantorrillas y abdomen para cerrar como campeón.' });

// Bloque 4
for (let i = 1; i <= 3; i++) {
  trenInferior2.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Izquierda)', reps: '15 reps', weight: 'Mancuerna | 1x 15.3 kg', notes: i === 1 ? 'Apoyo en pared, contrae al máximo arriba 1s y estira completo al bajar. Que esas pantorrillas se llenen de sangre.' : i === 2 ? 'Esa pantorrilla ya arde, perfecto. Misma calidad, no te apures. Cada contracción la pone más fuerte.' : 'Última serie, que esas pantorrillas queden como rocas. Aprieta arriba, estira abajo. Todo cuenta.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior2.push({ type: 'rest', duration: 15, nextExercise: 'Elevación de pantorrillas (Derecha)', phrase: 'Ahora la otra, mismo ritmo. Pantorrillas simétricas y fuertes, ese es el objetivo.' });
  trenInferior2.push({
    type: 'exercise', title: 'Elevación de pantorrillas (Derecha)', reps: '15 reps', weight: 'Mancuerna | 1x 15.3 kg', notes: i === 1 ? 'Misma técnica: contrae 1s arriba y estira completo. Que esa pantorrilla derecha quede igual de trabajada.' : i === 2 ? 'Esos gemelos están ardiendo, eso es. Mantén la calidad, no pierdas rango de movimiento.' : 'Última con la derecha, cada rep cuenta. Esos gemelos van a estar marcados, confía.', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Gemelos', percentage: 90, type: 'primary' }, { name: 'Sóleo', percentage: 10, type: 'secondary' }]
  });
  trenInferior2.push({ type: 'rest', duration: 15, nextExercise: 'Abdominales', phrase: 'Pantorrillas listas, ahora abdominales. Cierra con un core de hierro.' });
  trenInferior2.push({
    type: 'exercise', title: 'Abdominales', reps: '15 reps', weight: 'Mancuerna | 1x 15.3 kg', notes: i === 1 ? 'Mancuerna al pecho, flexiona la columna contrayendo fuerte. No tires del cuello. Siente cómo ese abdomen se aprieta en cada rep.' : i === 2 ? 'Ese six-pack se construye rep a rep. Enrolla la columna, contrae arriba, baja controlado. No aflojes.' : 'Últimos abdominales del día. Déjalo todo aquí, que ese core quede duro como concreto. ¡Tú puedes!', block: 'Bloque 4: Pantorrillas y Abdomen', seriesInfo: `Serie ${i} de 3`,
    muscles: [{ name: 'Recto Abdominal', percentage: 80, type: 'primary' }, { name: 'Oblicuos', percentage: 20, type: 'secondary' }]
  });
  if (i < 3) trenInferior2.push({ type: 'rest', duration: 45, nextExercise: 'Elevación de pantorrillas (Izquierda)', phrase: i === 1 ? 'Primera ronda del circuito final hecha. Respira, mueve las piernas y vamos por la segunda.' : 'Última ronda, cierra este entrenamiento como un guerrero. Todo el dolor de hoy es el progreso de mañana.' });
}

export const routines: Record<string, WorkoutStep[]> = {
  Lunes: trenSuperior,
  Martes: trenInferior1,
  Jueves: trenSuperior,
  Viernes: trenInferior2,
};
