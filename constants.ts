
import { Exercise, LoggingType } from './types';

export const INITIAL_CATEGORIES = ['Strength', 'Lower Body', 'Core', 'Cardio', 'Handstand', 'Mobility'];

export const INITIAL_EXERCISES: Exercise[] = [
  // MONDAY RR A
  {
    id: 'weighted-pullups',
    name: 'Weighted Pull-ups',
    sets: 5,
    repsOrTime: '4-6',
    rest: 150,
    loggingType: LoggingType.REPS,
    cues: ['Dead hang every rep', 'Initiate by pulling shoulders down first', 'Smooth, even tempo'],
    hints: ['Stop when speed slows', 'Leave ~2 reps in reserve', 'Never grind the last rep'],
    category: 'Strength'
  },
  {
    id: 'cossack-squats',
    name: 'Cossack Squats',
    sets: 3,
    repsOrTime: '6-8',
    rest: 75,
    loggingType: LoggingType.REPS,
    cues: ['Sit into the hip', 'Heel flat on the working leg', 'Long spine'],
    hints: ['Use hands for balance', 'Depth only as far as control allows'],
    category: 'Lower Body'
  },
  {
    id: 'dips',
    name: 'Dips',
    sets: 4,
    repsOrTime: '6-8',
    rest: 105,
    loggingType: LoggingType.REPS,
    cues: ['Shoulders down and stable', 'Elbows track naturally', 'Full lockout without shrugging'],
    hints: ['Slight forward lean is fine', 'If shoulders complain, shorten ROM slightly'],
    category: 'Strength'
  },
  {
    id: 'ring-hamstring-curls',
    name: 'Ring Hamstring Curls',
    sets: 3,
    repsOrTime: '6-8',
    rest: 90,
    loggingType: LoggingType.REPS,
    cues: ['Hips slightly off floor', 'Slow eccentric (≈3 s)', 'Core lightly braced'],
    hints: ['Reduce to 2 sets if hamstrings fatigue early', 'Never rush reps'],
    category: 'Lower Body'
  },
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    sets: 3,
    repsOrTime: '20-30',
    rest: 50,
    loggingType: LoggingType.TIME,
    cues: ['Lower back pressed into floor', 'Ribs down', 'Legs only as low as you can control'],
    hints: [],
    category: 'Core'
  },
  // TUESDAY Cardio / HS
  {
    id: 'incline-walking',
    name: 'Incline Walking (Zone 2)',
    sets: 1,
    repsOrTime: '1800-2700',
    rest: 0,
    loggingType: LoggingType.TIME,
    cues: ['Nasal breathing only', 'Conversational pace', 'Incline ≤10%'],
    hints: ['If quads burn, slow down'],
    category: 'Cardio'
  },
  {
    id: 'hs-prep',
    name: 'Wrist & Shoulder Prep',
    sets: 1,
    repsOrTime: '300',
    rest: 0,
    loggingType: LoggingType.TIME,
    cues: ['Wrist circles, pulses', 'Scapular shrugs in plank'],
    hints: [],
    category: 'Handstand'
  },
  {
    id: 'wall-line-holds',
    name: 'Wall Line Holds',
    sets: 5,
    repsOrTime: '30-45',
    rest: 50,
    loggingType: LoggingType.TIME,
    cues: ['Push tall through shoulders', 'Ribs tucked, glutes lightly squeezed'],
    hints: ['If line breaks → stop the set'],
    category: 'Handstand'
  },
  {
    id: 'pancake',
    name: 'Seated Straddle Lean (Pancake)',
    sets: 3,
    repsOrTime: '30-45',
    rest: 60,
    loggingType: LoggingType.TIME,
    cues: ['Long spine', 'Hinge at hips, not spine', 'Active legs'],
    hints: [],
    category: 'Mobility'
  },
  // WEDNESDAY RR B
  {
    id: 'rows',
    name: 'Rows (BW/Light)',
    sets: 4,
    repsOrTime: '8-10',
    rest: 105,
    loggingType: LoggingType.REPS,
    cues: ['Initiate with scapula', '3-second eccentric', 'Chest to rings/bar'],
    hints: ['Should feel controlled'],
    category: 'Strength'
  },
  {
    id: 'pushups',
    name: 'Push-ups',
    sets: 4,
    repsOrTime: '8-12',
    rest: 75,
    loggingType: LoggingType.REPS,
    cues: ['Straight body line', 'Elbows ~30-45°', 'Full lockout with protraction'],
    hints: [],
    category: 'Strength'
  },
  {
    id: 'back-extension',
    name: 'Back Extension / Superman',
    sets: 2,
    repsOrTime: '10-12',
    rest: 60,
    loggingType: LoggingType.REPS,
    cues: [],
    hints: [],
    category: 'Strength'
  }
];

export const INITIAL_SCHEDULE: Record<string, string[]> = {
  'Monday': ['weighted-pullups', 'cossack-squats', 'dips', 'ring-hamstring-curls', 'hollow-body-hold'],
  'Tuesday': ['incline-walking', 'hs-prep', 'wall-line-holds', 'pancake'],
  'Wednesday': ['rows', 'cossack-squats', 'pushups', 'back-extension'],
  'Thursday': ['incline-walking', 'hs-prep', 'wall-line-holds', 'pancake'],
  'Friday': ['weighted-pullups', 'cossack-squats', 'dips', 'ring-hamstring-curls', 'hollow-body-hold'],
  'Saturday': [],
  'Sunday': []
};

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
