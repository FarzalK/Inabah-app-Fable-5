export type HeartRating = "Heedless" | "Struggling" | "Striving" | "Present" | "Mindful";
export type HeartState = "Present" | "Distracted" | "Restless" | "Peaceful" | "Tearful" | "Numb";

export interface MuraqabahSession {
  id: string;
  date: string;
  nameNumber: number;
  nameTransliteration: string;
  durationMinutes: number;
  heartState: HeartState;
  note?: string;
  breathingUsed: boolean;
}
export type NafsStation = "Ammārah" | "Lawwāmah" | "Mulhamah" | "Mutma'innah";

export interface Category {
  id: string;
  name: string;
  sub: string;
  ayah: string;
  prompt: string;
}

export interface SessionSummary {
  categoryRatings: Record<string, HeartRating>;
  nafsRating: NafsStation;
  reflection: string;
  pattern: string;
  closingAyah: string;
}

export interface SavedSession {
  id: string;
  date: string;
  categories: string[];
  answers: Record<string, string>;
  summary: SessionSummary;
  resolution?: string;
}
