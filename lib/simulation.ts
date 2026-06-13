import type { SavedSession, SessionSummary, HeartRating, NafsStation } from "@/types";
import type { MuraqabahSession, HeartState } from "@/lib/muraqabah-storage";
import { CATEGORIES } from "@/lib/data";
import { ASMA_AL_HUSNA } from "@/lib/asma";

const HEART_RATINGS: HeartRating[] = ["Heedless", "Struggling", "Striving", "Present", "Mindful"];
const NAFS_STATIONS: NafsStation[] = ["Ammārah", "Lawwāmah", "Mulhamah", "Mutma'innah"];
const HEART_STATES: HeartState[] = ["Present", "Distracted", "Restless", "Peaceful", "Tearful", "Numb"];

const SAMPLE_ANSWERS: Record<string, string[]> = {
  salah: [
    "My prayers were on time today but I struggled with focus during Dhuhr. Fajr was the most present I felt.",
    "I missed Asr by about 20 minutes. The other prayers were on time but rushed.",
    "Alhamdullilah all five were on time. I took extra time in sujood during Maghrib.",
    "Fajr was delayed, the rest were on time. My mind wandered during Isha.",
    "Prayers were consistent today. I felt a real connection during Fajr.",
  ],
  dhikr: [
    "I remembered Allah throughout the day with some morning adhkar. Could do more.",
    "I was mostly caught up in work and forgot dhikr until evening.",
    "Made istighfar on my commute. Said the evening adhkar before bed.",
    "I recited some Quran after Fajr. Dhikr was light through the day.",
    "Consistent dhikr today — morning and evening adhkar both done.",
  ],
  speech: [
    "I said something about a colleague I shouldn't have. I regret it.",
    "My tongue was mostly guarded. One moment of impatience with family.",
    "I was careful with my words today. No backbiting that I recall.",
    "Had a difficult conversation but stayed truthful. One moment of sarcasm.",
    "Alhamdullilah. I paused before speaking today and it helped.",
  ],
  gaze: [
    "Scrolled too long on social media. Some content I shouldn't have stayed on.",
    "I was mindful of my gaze today. Avoided certain apps.",
    "Slipped a few times with what I watched online. Need to be more careful.",
    "Good day for this. I closed a few things I shouldn't have opened.",
    "Social media pulled me in for too long. I knew it but kept scrolling.",
  ],
  treatment: [
    "I was short with my family in the evening. Need to work on this.",
    "I helped a colleague today and was patient with my parents.",
    "Good day. I checked in on a friend who has been struggling.",
    "I was kind to strangers but impatient at home — the opposite of what matters most.",
    "Tried to give my full attention to people. One moment of dismissiveness.",
  ],
  time: [
    "The day passed quickly and I'm not sure what I accomplished. Ghafla was high.",
    "I had clear intentions for the day and mostly followed through.",
    "Too much idle time. I need to structure my evenings better.",
    "Productive day with intention behind most tasks. Grateful.",
    "The morning was intentional, the afternoon drifted. Evening was better.",
  ],
};

const SAMPLE_REFLECTIONS = [
  "Today reflects a soul that is genuinely striving — the Prophet ﷺ said 'The strong believer is better and more beloved to Allah than the weak believer.' Your effort to account yourself tonight is itself an act of worship.",
  "Allah says: 'And whoever relies upon Allah — then He is sufficient for him.' Your shortcomings today are acknowledged; what matters is that you returned to account yourself before the night closed.",
  "Ibn al-Qayyim wrote that the heart oscillates between heedlessness and awareness — you are not failing, you are in the natural movement of the spiritual life. Continue with patience.",
  "The Prophet ﷺ said: 'All of the children of Adam make mistakes, and the best of those who make mistakes are those who repent.' Your honesty tonight is the beginning of tomorrow's improvement.",
  "Allah's mercy precedes His wrath — your awareness of where you fell short is already a sign of a living conscience. The Lawwāmah soul blames itself, and that blame is a mercy.",
];

const SAMPLE_PATTERNS = [
  "A recurring tension between your outer obligations and inner presence — salah and treatment of others appear as areas of genuine effort, while gaze and time show the pull of heedlessness.",
  "Speech and treatment of others appear connected — moments of impatience seem to arise in familiar settings. This is the nafs seeking comfort at the expense of those closest to you.",
  "Time and intention show the clearest gap between what you intend at the start of the day and what actually unfolds. The afternoon hours seem to be where ghafla enters.",
  "Your salah appears as an anchor even on difficult days. The categories around gaze and speech show the areas where the nafs still needs discipline.",
  "There is genuine effort across all categories today. The remaining struggle is consistency — converting single-day effort into sustained istiqamah.",
];

const SAMPLE_CLOSING_AYAHS = [
  '"Indeed, with hardship comes ease." — Ash-Sharh 94:6',
  '"And seek help through patience and prayer." — Al-Baqarah 2:45',
  '"Verily, in the remembrance of Allah do hearts find rest." — Ar-Ra\'d 13:28',
  '"And He found you lost and guided you." — Ad-Duha 93:7',
  '"So remember Me; I will remember you." — Al-Baqarah 2:152',
  '"Allah does not burden a soul beyond that it can bear." — Al-Baqarah 2:286',
  '"The patient will be given their reward without account." — Az-Zumar 39:10',
];

const SAMPLE_NOTES = [
  "I felt a stillness I haven't felt in a while. Something shifted.",
  "My mind kept drifting to work. I brought it back each time but it was a struggle.",
  "The name felt very present today — I kept returning to it throughout.",
  "I found myself tearful without knowing why. A release of some kind.",
  "Harder than expected to be still. But the last few minutes felt different.",
  "I want to sit with this name again tomorrow.",
  "",
  "",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Rating ranges per nafs station — which ratings are plausible for each station
const STATION_RATING_POOL: Record<NafsStation, HeartRating[]> = {
  "Ammārah":     ["Heedless", "Heedless", "Struggling"],
  "Lawwāmah":    ["Struggling", "Struggling", "Striving"],
  "Mulhamah":    ["Striving", "Striving", "Present"],
  "Mutma'innah": ["Present", "Present", "Mindful"],
};

// Answers that correspond to low/mid/high spiritual state per category
const SAMPLE_ANSWERS_BY_LEVEL: Record<string, Record<"low" | "mid" | "high", string[]>> = {
  salah: {
    low:  ["I missed several prayers today. The day ran away from me.", "Fajr slipped, and the rest felt rushed and disconnected.", "I prayed but my heart was completely elsewhere throughout."],
    mid:  ["My prayers were on time but I struggled with focus during Dhuhr.", "Fajr was delayed, the rest were on time. My mind wandered during Isha.", "I prayed all five but khushoo was inconsistent."],
    high: ["Alhamdullilah all five were on time. I took extra time in sujood during Maghrib.", "Prayers were consistent today. I felt a real connection during Fajr.", "Every prayer felt grounded today. I extended my sujood and made dua with presence."],
  },
  dhikr: {
    low:  ["I didn't make any dhikr today beyond the obligatory. Completely caught up in dunya.", "I forgot the morning and evening adhkar entirely.", "My heart felt very distant from Allah today. No real remembrance."],
    mid:  ["I remembered Allah throughout the day with some morning adhkar. Could do more.", "Made istighfar on my commute. Said the evening adhkar before bed.", "Dhikr was light but present. I could be more intentional."],
    high: ["Consistent dhikr today — morning and evening adhkar both completed with presence.", "I recited Quran after Fajr and kept my tongue moist with remembrance.", "I felt close to Allah today. Dhikr came naturally throughout the day."],
  },
  speech: {
    low:  ["I said things I regret — backbiting and harsh words came out today.", "My tongue was sharp and I said things that hurt someone.", "I complained and gossiped more than I should have today."],
    mid:  ["My tongue was mostly guarded. One moment of impatience with family.", "Had a difficult conversation but stayed truthful. One moment of sarcasm.", "Mostly okay today but one slip I'd like to take back."],
    high: ["Alhamdullilah. I paused before speaking and guarded my tongue all day.", "I was careful with my words. No backbiting that I can recall.", "I spoke only what was good or stayed silent. I'm grateful for that."],
  },
  gaze: {
    low:  ["Scrolled too long. Watched things I shouldn't have. My heart felt heavy after.", "I fell into old habits with what I consumed online today.", "My gaze was completely unguarded. I let too much in."],
    mid:  ["Slipped a few times with what I watched online. Need to be more careful.", "Scrolled a bit too long on social media but caught myself.", "Some things entered my gaze that shouldn't have. Working on this."],
    high: ["I was mindful of my gaze today. Avoided certain apps intentionally.", "Good day for this. I closed a few things I shouldn't have opened.", "I protected my gaze well today. What I consumed was clean and beneficial."],
  },
  treatment: {
    low:  ["I was short-tempered with family and dismissive with people I encountered.", "I was impatient and unkind today. It bothered me after.", "I treated people poorly, especially those closest to me."],
    mid:  ["I was kind to strangers but impatient at home — the opposite of what matters most.", "One moment of dismissiveness I regret. Otherwise okay.", "I tried to be patient but slipped once with someone I care about."],
    high: ["I checked in on a friend who has been struggling. Felt good to give.", "I helped a colleague and was patient with my parents today.", "I was fully present with people. Gave my attention generously."],
  },
  time: {
    low:  ["The day passed and I don't know where it went. Completely in ghafla.", "Wasted most of the day. My intentions were there but my actions weren't.", "Too much idle time. No real intention behind how I spent my hours."],
    mid:  ["The morning was intentional, the afternoon drifted. Evening was better.", "Had some clear intentions but didn't fully follow through.", "Productive in parts but lost focus in the afternoon."],
    high: ["I had clear intentions for the day and followed through on most of them.", "Productive day with a real sense of purpose behind each task.", "I planned my time with intention and felt grounded throughout."],
  },
};

function levelForStation(station: NafsStation): "low" | "mid" | "high" {
  if (station === "Ammārah") return "low";
  if (station === "Lawwāmah") return "mid";
  return "high";
}

export function generateMuhasabahSession(
  targetStation?: NafsStation,
  activeCategories?: string[]
): { session: SavedSession; answers: Record<string, string> } {
  const station: NafsStation = targetStation ?? pick(NAFS_STATIONS);
  const ratingPool = STATION_RATING_POOL[station];
  const level = levelForStation(station);
  const cats = activeCategories ?? CATEGORIES.map((c) => c.id);

  const answers: Record<string, string> = {};
  const categoryRatings: Record<string, HeartRating> = {};

  cats.forEach((catId) => {
    const levelAnswers = SAMPLE_ANSWERS_BY_LEVEL[catId]?.[level] ?? SAMPLE_ANSWERS[catId] ?? ["Reflected today."];
    answers[catId] = pick(levelAnswers);
    // Occasionally allow one adjacent rating for realism
    const useAdjacent = Math.random() < 0.2;
    if (useAdjacent && level === "mid") {
      categoryRatings[catId] = Math.random() > 0.5 ? "Heedless" : "Present";
    } else {
      categoryRatings[catId] = pick(ratingPool);
    }
  });

  const summary: SessionSummary = {
    categoryRatings,
    nafsRating: station,
    reflection: pick(SAMPLE_REFLECTIONS),
    pattern: pick(SAMPLE_PATTERNS),
    closingAyah: pick(SAMPLE_CLOSING_AYAHS),
  };

  const session: SavedSession = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    categories: cats,
    answers,
    summary,
  };

  return { session, answers };
}

export function generateMuraqabahSession(): MuraqabahSession {
  const name = pick(ASMA_AL_HUSNA);
  const durations = [5, 10, 15, 20];

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    nameNumber: name.number,
    nameTransliteration: name.transliteration,
    durationMinutes: pick(durations),
    heartState: pick(HEART_STATES),
    note: pick(SAMPLE_NOTES) || undefined,
    breathingUsed: Math.random() > 0.5,
  };
}
