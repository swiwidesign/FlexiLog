
export enum LoggingType {
  REPS = 'REPS',
  TIME = 'TIME'
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repsOrTime: string;
  rest: number; // in seconds
  loggingType: LoggingType;
  cues: string[];
  hints: string[];
  category: string;
}

export interface DayConfig {
  steps: string[]; // Sequence of Exercise IDs, each entry represents one set
}

export interface WeeklySchedule {
  [key: string]: DayConfig;
}

export interface SetLog {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  value: number;
  type: LoggingType;
  timestamp: number;
}

export interface WorkoutLog {
  id: string;
  dayId: string;
  date: string;
  sets: SetLog[];
}

export interface SessionState {
  isActive: boolean;
  dayId: string;
  stepIndex: number; // Current index in the steps array
  isResting: boolean;
  restTimeLeft: number;
  completedSets: SetLog[];
}
