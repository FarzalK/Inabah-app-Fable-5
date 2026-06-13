import type { Category, HeartRating, NafsStation } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "salah",
    name: "Salah",
    sub: "Prayer — quality & punctuality",
    ayah: '"Indeed, performing prayers is a duty on the believers at the appointed times." — An-Nisa 4:103 · The Clear Quran (Dr. Mustafa Khattab)',
    prompt:
      "How were your prayers today? Were they on time, with presence of heart, or did any slip — in timing, focus, or spirit?",
  },
  {
    id: "dhikr",
    name: "Dhikr & Connection",
    sub: "Remembrance of Allah beyond salah",
    ayah: '"Surely in the remembrance of Allah do hearts find comfort." — Ar-Ra\'d 13:28 · The Clear Quran (Dr. Mustafa Khattab)',
    prompt:
      "Did your heart turn to Allah outside of salah today? Was there dhikr, reflection on His names, or a moment of true awareness?",
  },
  {
    id: "speech",
    name: "Speech",
    sub: "Backbiting, lying, idle talk",
    ayah: '"Not a word does one utter without having a ˹vigilant˺ observer ready ˹to write it down˺." — Qaf 50:18 · The Clear Quran (Dr. Mustafa Khattab)',
    prompt:
      "How was your tongue today? Did any words slip that you regret — backbiting, exaggeration, or speech that carried no goodness?",
  },
  {
    id: "gaze",
    name: "Gaze & Consumption",
    sub: "What you watched, listened to, consumed",
    ayah: '"Tell the believing men to lower their gaze and guard their chastity. That is purer for them." — An-Nur 24:30 · The Clear Quran (Dr. Mustafa Khattab)',
    prompt:
      "What did you allow your eyes and ears to consume today? Did anything enter your heart that should not have?",
  },
  {
    id: "treatment",
    name: "Treatment of Others",
    sub: "Family, colleagues, strangers",
    ayah: '"Worship Allah ˹alone˺ and associate none with Him. And be kind to parents, relatives, orphans, the poor, near and distant neighbours..." — An-Nisa 4:36 · The Clear Quran (Dr. Mustafa Khattab)',
    prompt:
      "How did you treat the people around you today — your family, colleagues, or strangers? Was your conduct what Allah would be pleased with?",
  },
  {
    id: "time",
    name: "Time & Intention",
    sub: "How you spent your day, niyyah",
    ayah: '"By the ˹passage of˺ time! Surely humanity is in ˹grave˺ loss, except those who have faith, do good, and urge each other to the truth, and urge each other to perseverance." — Al-\'Asr 103:1-3 · The Clear Quran (Dr. Mustafa Khattab)',
    prompt:
      "How was your time spent today? Were your actions carried by clear intention, or did hours pass in heedlessness?",
  },
];

export const HEART_RATINGS: HeartRating[] = [
  "Heedless",
  "Struggling",
  "Striving",
  "Present",
  "Mindful",
];

export const NAFS_STATIONS: NafsStation[] = [
  "Ammārah",
  "Lawwāmah",
  "Mulhamah",
  "Mutma'innah",
];

export const HEART_RATING_STYLES: Record<HeartRating, string> = {
  Heedless:  "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  Struggling:"bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Striving:  "bg-[#EDF0DC] text-[#5C7040] dark:bg-[#1E2816] dark:text-[#A0B878]",
  Present:   "bg-[#E8F0D8] text-[#4A6830] dark:bg-[#182010] dark:text-[#B0C888]",
  Mindful:   "bg-[#F0EDE0] text-[#7A6840] dark:bg-[#201C0E] dark:text-[#C8B870]",
};

export const NAFS_STATION_STYLES: Record<NafsStation, string> = {
  "Ammārah":     "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  "Lawwāmah":    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "Mulhamah":    "bg-[#E9EDC9] text-[#5C6840] dark:bg-[#1E2010] dark:text-[#A8B870]",
  "Mutma'innah": "bg-[#CCD5AE] text-[#3A5020] dark:bg-[#182010] dark:text-[#B0C888]",
};

// ── Shared colour maps — import these instead of redefining per component ──────

export const STATION_COLORS: Record<NafsStation, string> = {
  "Ammārah":     "#C0392B",
  "Lawwāmah":    "#D4853A",
  "Mulhamah":    "#5B8DB8",
  "Mutma'innah": "#5C7A5C",
};

export const CAT_COLORS: Record<string, string> = {
  salah:     "#5C7A5C",
  dhikr:     "#D4A373",
  speech:    "#8B6F47",
  gaze:      "#B5674D",
  treatment: "#7A9E7A",
  time:      "#A08050",
};

export const AI_SYSTEM_PROMPT = `You are a spiritual guide conducting a Muhāsabah (self-accounting) session with a Muslim who has reflected on their day.

Your tone is balanced — honest about shortcomings but grounded in hope and mercy. Never harsh, never sycophantic. Speak like a wise elder who cares deeply.

SOURCE HIERARCHY — follow this strictly:
1. PRIMARY: Quran — cite specific ayaat with surah name and verse number when relevant to what the person shared. This is always the first place you look. IMPORTANT: Use ONLY The Clear Quran translation by Dr. Mustafa Khattab for all Quranic quotes. Cite as: Surah Name X:Y — do NOT include any translation name or attribution in the output text.
2. PRIMARY: Hadith — cite authentic hadith (Bukhari, Muslim, Tirmidhi, Abu Dawud, Ibn Majah, Ahmad) with narrator and collection when relevant. Prefer well-known, authentic narrations. Never fabricate or paraphrase as if quoting.
3. SECONDARY (only when Quran/hadith do not directly address the theme): classical scholars — al-Ghazali's Ihya, Ibn al-Qayyim's Madarij al-Salikeen, Ibn Rajab al-Hanbali. Scholarly quotes supplement, never replace, primary sources.

For the "reflection" field: ground it in at least one Quranic ayah or authentic hadith directly relevant to what the person shared. If a scholar's insight adds depth without displacing the primary source, you may include it briefly after.
For the "closingAyah" field: use a Quranic ayah OR an authentic hadith — not a scholar quote. Format Quranic quotes as: the text, then "— Surah Name X:Y". Format hadith as: "— Narrated by [Companion], [Collection]".

Return ONLY valid JSON, no preamble, no markdown fences:
{
  "categoryRatings": { "catId": "HeartWord" },
  "nafsRating": "NafsWord",
  "reflection": "2-3 sentences grounded in Quran and/or authentic hadith, with scholarly insight only if it adds something the primary sources do not cover",
  "pattern": "1-2 sentences noting the most significant spiritual theme or recurring struggle",
  "closingAyah": "A Quranic ayah or authentic hadith directly relevant to their session"
}

For categoryRatings: use exactly one of — Heedless, Struggling, Striving, Present, Mindful.
For nafsRating: use exactly one of — Ammārah, Lawwāmah, Mulhamah, Mutma'innah.`;
