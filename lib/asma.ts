export interface AsmaEntry {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  ayah: string;
  ayahRef: string;
  scholarlyNote: string;
  contemplation: string;
  themes: string[]; // for contextual suggestion
}

// All Quranic translations are from The Clear Quran by Dr. Mustafa Khattab.
const SRC = "The Clear Quran (Dr. Mustafa Khattab)";

export const ASMA_AL_HUSNA: AsmaEntry[] = [
  {
    number: 1, arabic: "ٱللَّٰه", transliteration: "Allah", meaning: "The One God",
    ayah: "He is Allah—there is no god ˹worthy of worship˺ except Him: Knower of the seen and unseen.",
    ayahRef: `Al-Hashr 59:22 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that this Name is the greatest of all Names, encompassing all attributes of perfection. Al-Ghazali says it is the Name to which all other Names are attributes.",
    contemplation: "Sit with the reality that there is nothing worthy of worship except Him. How does this truth change your relationship with everything else in your life?",
    themes: ["general", "tawhid"]
  },
  {
    number: 2, arabic: "ٱلرَّحْمَٰن", transliteration: "Ar-Rahman", meaning: "The Most Compassionate",
    ayah: "The Most Compassionate taught the Quran, created humanity, ˹and˺ taught them speech.",
    ayahRef: `Ar-Rahman 55:1-4 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains Ar-Rahman as the one whose mercy encompasses all of creation without exception — believer and disbeliever alike receive His sustenance and care.",
    contemplation: "His mercy reached you before you asked for it. What mercy did Allah extend to you today that you did not earn?",
    themes: ["mercy", "gratitude", "general"]
  },
  {
    number: 3, arabic: "ٱلرَّحِيم", transliteration: "Ar-Raheem", meaning: "The Most Merciful",
    ayah: "For He is Most Merciful to the believers.",
    ayahRef: `Al-Ahzab 33:43 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim distinguishes Ar-Raheem as mercy specifically directed at the believers in the next life — a special, earned mercy flowing from deeds and faith.",
    contemplation: "You are among those this mercy is promised to. How does knowing Allah's mercy is specifically turned toward you as a believer change how you carry yourself today?",
    themes: ["mercy", "hope", "believers"]
  },
  {
    number: 4, arabic: "ٱلْمَلِك", transliteration: "Al-Malik", meaning: "The King",
    ayah: "Exalted is Allah, the True King!",
    ayahRef: `Ta-Ha 20:114 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that true sovereignty belongs only to Allah — earthly kings borrow their authority and it will be stripped from them. On the Day of Judgment, 'Whose is the kingdom today? That of Allah, the One, the Prevailing.'",
    contemplation: "Every authority you encounter today — at work, at home, in society — is borrowed. How does remembering the true King change how you relate to power?",
    themes: ["sovereignty", "dunya", "perspective"]
  },
  {
    number: 5, arabic: "ٱلْقُدُّوس", transliteration: "Al-Quddus", meaning: "The Most Holy",
    ayah: "He is Allah—there is no god ˹worthy of worship˺ except Him: the King, the Most Holy.",
    ayahRef: `Al-Hashr 59:23 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim says Al-Quddus means Allah is utterly free from every imperfection, deficiency, and likeness to creation. The angels glorify Him with this Name ceaselessly.",
    contemplation: "You are standing before the utterly Pure. What in your heart needs to be purified before you can draw closer to Him?",
    themes: ["purification", "tawbah", "heart"]
  },
  {
    number: 6, arabic: "ٱلسَّلَام", transliteration: "As-Salam", meaning: "The Source of Serenity",
    ayah: "He is Allah—there is no god ˹worthy of worship˺ except Him: the King, the Most Holy, the All-Perfect, the Source of Serenity.",
    ayahRef: `Al-Hashr 59:23 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains that As-Salam means Allah is free from all defects and the source of all safety and peace. Paradise itself is called Dar as-Salam — the Home of Peace.",
    contemplation: "All the peace you seek exists with Him. Where are you currently looking for peace outside of Allah, and how might you redirect that?",
    themes: ["peace", "anxiety", "reliance"]
  },
  {
    number: 7, arabic: "ٱلْمُؤْمِن", transliteration: "Al-Mu'min", meaning: "The Granter of Security",
    ayah: "He is Allah: the Creator, the Inventor, the Shaper. He ˹alone˺ has the Most Beautiful Names.",
    ayahRef: `Al-Hashr 59:24 · ${SRC}`,
    scholarlyNote: "Ibn Rajab explains Al-Mu'min as the one who grants security to His servants and whose promise is truth. He is trusted completely because He never breaks His covenant.",
    contemplation: "Allah has granted you security. What fears are you carrying that you have not yet entrusted to the one who is the ultimate source of safety?",
    themes: ["fear", "trust", "security"]
  },
  {
    number: 8, arabic: "ٱلْمُهَيْمِن", transliteration: "Al-Muhaymin", meaning: "The Guardian and Overseer",
    ayah: "We have revealed to you ˹O Prophet˺ this Book with the truth, as a confirmation of previous Scriptures and a supreme authority on them.",
    ayahRef: `Al-Ma'idah 5:48 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Muhaymin encompasses three meanings: knowing the state of all things, protecting them, and overseeing their affairs. Nothing escapes His watchful care.",
    contemplation: "Allah is overseeing your life completely. What aspect of your situation are you trying to control that you could release to His guardianship?",
    themes: ["tawakkul", "control", "reliance"]
  },
  {
    number: 9, arabic: "ٱلْعَزِيز", transliteration: "Al-Aziz", meaning: "The Almighty",
    ayah: "Yet honor ˹and power˺ belong ˹only˺ to Allah, His Messenger, and the believers.",
    ayahRef: `Al-Munafiqun 63:8 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim says Al-Aziz means He is invincible — no one can reach Him through force, and He is self-sufficient, needing nothing from creation.",
    contemplation: "True honor belongs only to Allah. Where in your life are you seeking honor or dignity from other than Him?",
    themes: ["honor", "ego", "dunya"]
  },
  {
    number: 10, arabic: "ٱلْجَبَّار", transliteration: "Al-Jabbar", meaning: "The Compeller and Restorer",
    ayah: "He is Allah: the Creator, the Inventor, the Shaper.",
    ayahRef: `Al-Hashr 59:24 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains Al-Jabbar has two meanings: the one who compels creation to His will, and the one who repairs and restores what is broken. Ibn al-Qayyim emphasizes the latter — He mends broken hearts.",
    contemplation: "Allah restores what is broken. What in you — in your heart, your relationships, your deen — do you need Him to mend?",
    themes: ["healing", "brokenness", "hope"]
  },
  {
    number: 11, arabic: "ٱلْمُتَكَبِّر", transliteration: "Al-Mutakabbir", meaning: "The Supremely Great",
    ayah: "Glorified is Allah far above what they associate with Him ˹in worship˺!",
    ayahRef: `Al-Hashr 59:23 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that greatness (kibr) is a garment of Allah alone — when a human wears it, it is a sin. But for Allah, it is His right and reality.",
    contemplation: "All greatness belongs to Allah. Where have you allowed pride or self-importance to enter your heart today?",
    themes: ["pride", "ego", "humility"]
  },
  {
    number: 12, arabic: "ٱلْخَالِق", transliteration: "Al-Khaliq", meaning: "The Creator",
    ayah: "He is Allah: the Creator, the Inventor, the Shaper.",
    ayahRef: `Al-Hashr 59:24 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains that Allah's creation is from nothing — a power belonging to no other being. Every created thing points back to Him as evidence.",
    contemplation: "You are something from nothing — entirely His creation. Sit with the miracle of your own existence. What does being created obligate you to?",
    themes: ["existence", "gratitude", "purpose"]
  },
  {
    number: 13, arabic: "ٱلْبَارِئ", transliteration: "Al-Bari'", meaning: "The Inventor",
    ayah: "He is Allah: the Creator, the Inventor, the Shaper.",
    ayahRef: `Al-Hashr 59:24 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim distinguishes Al-Bari' as the one who distinguishes and separates each created thing — giving it its unique form and nature, free of error.",
    contemplation: "You were formed with precision and intention. How does knowing you were deliberately fashioned — not by accident — change how you see yourself?",
    themes: ["identity", "purpose", "self-worth"]
  },
  {
    number: 14, arabic: "ٱلْمُصَوِّر", transliteration: "Al-Musawwir", meaning: "The Shaper of Forms",
    ayah: "He is the One Who shapes you in the womb as He wills.",
    ayahRef: `Al Imran 3:6 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Musawwir gave each creation its particular image, distinguishing one from another with wisdom and beauty.",
    contemplation: "Your face, your voice, your form — all chosen by Allah. How do you relate to the body and form He gave you?",
    themes: ["gratitude", "body", "acceptance"]
  },
  {
    number: 15, arabic: "ٱلْغَفَّار", transliteration: "Al-Ghaffar", meaning: "The All-Forgiving",
    ayah: "But I am truly All-Forgiving to whoever repents, believes, and does good, then stays on the Right Path.",
    ayahRef: `Ta-Ha 20:82 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim emphasizes the intensified form — Al-Ghaffar forgives again and again, sin after sin. The door of repentance does not close because He grows tired of forgiving.",
    contemplation: "He has forgiven you before. He will forgive you again. What are you withholding from Him in repentance because you feel unworthy of being forgiven again?",
    themes: ["tawbah", "forgiveness", "hope"]
  },
  {
    number: 16, arabic: "ٱلْقَهَّار", transliteration: "Al-Qahhar", meaning: "The Supreme",
    ayah: "He is the One, the Supreme.",
    ayahRef: `Ar-Ra'd 13:16 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Qahhar subdues all of creation — nothing resists His will. Every mighty thing is humbled before Him.",
    contemplation: "What in your life feels overwhelming or out of control? Remember that Al-Qahhar subdues all things — including what frightens you.",
    themes: ["fear", "tawakkul", "perspective"]
  },
  {
    number: 17, arabic: "ٱلْوَهَّاب", transliteration: "Al-Wahhab", meaning: "The Giver of All",
    ayah: "˹Pray,˺ 'Our Lord! Do not let our hearts deviate after You have guided us. Grant us Your mercy. You are indeed the Giver ˹of all bounties˺.'",
    ayahRef: `Al Imran 3:8 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim says Al-Wahhab gives without expectation of return and without limit — His giving flows from His own generosity, not from anything earned.",
    contemplation: "Everything good in your life was given without you fully earning it. What gifts has Allah given you that you have forgotten to acknowledge?",
    themes: ["gratitude", "gifts", "generosity"]
  },
  {
    number: 18, arabic: "ٱلرَّزَّاق", transliteration: "Ar-Razzaq", meaning: "The All-Provider",
    ayah: "Surely Allah is the ˹sole˺ Provider—Lord of all Power, the Almighty.",
    ayahRef: `Adh-Dhariyat 51:58 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Ar-Razzaq provides for every living creature — from the ant beneath the stone to the fish in the ocean. Not a single soul goes unprovided for.",
    contemplation: "Your rizq is written and guaranteed. What anxieties about provision are you carrying that you could release to Ar-Razzaq today?",
    themes: ["rizq", "anxiety", "tawakkul"]
  },
  {
    number: 19, arabic: "ٱلْفَتَّاح", transliteration: "Al-Fattah", meaning: "The Judge",
    ayah: "Say, 'Our Lord will gather us together, then He will judge between us with the truth. He is the All-Knowing Judge.'",
    ayahRef: `Saba 34:26 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim says Al-Fattah opens what is closed — locked doors, sealed hearts, difficult matters. He is called upon when all paths seem closed.",
    contemplation: "What door in your life feels sealed shut? Sit with Al-Fattah and ask Him to open what only He can open.",
    themes: ["hope", "difficulty", "dua"]
  },
  {
    number: 20, arabic: "ٱلْعَلِيم", transliteration: "Al-Alim", meaning: "The All-Knowing",
    ayah: "With Him are the keys of the unseen—no one knows them except Him.",
    ayahRef: `Al-An'am 6:59 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Allah's knowledge encompasses everything — what has passed, what is, and what will never be but would have been if it existed. Nothing is hidden from Him.",
    contemplation: "He knows you completely — what you show and what you hide. How does being fully known by Allah make you feel right now?",
    themes: ["muraqabah", "sincerity", "awareness"]
  },
  {
    number: 21, arabic: "ٱلْقَابِض", transliteration: "Al-Qabid", meaning: "The Withholder",
    ayah: "It is Allah ˹alone˺ Who decreases and increases ˹wealth˺. And to Him you will ˹all˺ be returned.",
    ayahRef: `Al-Baqarah 2:245 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim pairs Al-Qabid with Al-Basit — He withholds with wisdom and gives with wisdom. What is withheld from you is never without purpose.",
    contemplation: "Something has been withheld from you. Can you trust that Al-Qabid withholds with wisdom, not cruelty?",
    themes: ["hardship", "wisdom", "patience"]
  },
  {
    number: 22, arabic: "ٱلْبَاسِط", transliteration: "Al-Basit", meaning: "The Extender",
    ayah: "It is Allah ˹alone˺ Who decreases and increases ˹wealth˺. And to Him you will ˹all˺ be returned.",
    ayahRef: `Al-Baqarah 2:245 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Basit extends rizq, mercy, and ease when He wills. The same hand that withholds also expands — trust in the wisdom of both.",
    contemplation: "He expands hearts, provisions, and circumstances. What constriction in your life are you asking Him to expand?",
    themes: ["ease", "hardship", "dua"]
  },
  {
    number: 23, arabic: "ٱلْخَافِض", transliteration: "Al-Khafid", meaning: "The Humbler",
    ayah: "˹Some˺ it will bring low; ˹others˺ it will lift high.",
    ayahRef: `Al-Waqi'ah 56:3 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Khafid humbles the arrogant and lowers the enemies of truth. No one is brought low by Allah except justly.",
    contemplation: "Arrogance in any form is brought low before Allah. Where is pride still living in your heart that needs to be humbled?",
    themes: ["humility", "pride", "perspective"]
  },
  {
    number: 24, arabic: "ٱلرَّافِع", transliteration: "Ar-Rafi'", meaning: "The Exalter",
    ayah: "˹Some˺ it will bring low; ˹others˺ it will lift high.",
    ayahRef: `Al-Waqi'ah 56:3 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains that Ar-Rafi' raises the believers in this life and the next — He elevates through faith, patience, and nearness to Him.",
    contemplation: "True elevation comes from Allah alone. Are you seeking to raise your status through Him or through the eyes of people?",
    themes: ["honor", "sincerity", "akhirah"]
  },
  {
    number: 25, arabic: "ٱلْمُعِز", transliteration: "Al-Mu'izz", meaning: "The Honourer",
    ayah: "Say, ˹O Prophet,˺ 'O Allah, Owner of all sovereignty! You give sovereignty to whoever You will, and strip it from whoever You will.'",
    ayahRef: `Al Imran 3:26 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim says honor given by Al-Mu'izz can never be taken away — but honor sought from people is fragile and fleeting.",
    contemplation: "The honor you seek from people — what would it look like to seek that same recognition from Allah instead?",
    themes: ["honor", "sincerity", "people-pleasing"]
  },
  {
    number: 26, arabic: "ٱلْمُذِل", transliteration: "Al-Mudhill", meaning: "The Humiliator",
    ayah: "You honour whoever You will and disgrace whoever You will.",
    ayahRef: `Al Imran 3:26 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that disgrace comes to those who turn away from Allah — seeking honor in what has no honor to give.",
    contemplation: "Where are you seeking honor in something that cannot truly give it? What would it mean to stop?",
    themes: ["humility", "dunya", "perspective"]
  },
  {
    number: 27, arabic: "ٱلسَّمِيع", transliteration: "As-Sami'", meaning: "The All-Hearing",
    ayah: "Allah is All-Hearing, All-Seeing.",
    ayahRef: `Al-Hajj 22:61 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains that As-Sami' hears every sound — the rustling of leaves, the footsteps of an ant, the whisper of the heart. Nothing is too quiet for Him.",
    contemplation: "Every word you have spoken today — every whisper, every complaint, every prayer — He heard it all. Does that awareness change what you want to say next?",
    themes: ["speech", "muraqabah", "sincerity"]
  },
  {
    number: 28, arabic: "ٱلْبَصِير", transliteration: "Al-Basir", meaning: "The All-Seeing",
    ayah: "Allah is All-Seeing of what you do.",
    ayahRef: `Al-Hujurat 49:18 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Basir sees the movement of a black ant on a black stone in the darkness of night. Your most hidden action is seen in full.",
    contemplation: "He sees you right now — your outward appearance and what is hidden within. Sit with being fully seen. Is there anything you would do differently if you held this awareness?",
    themes: ["muraqabah", "gaze", "sincerity"]
  },
  {
    number: 29, arabic: "ٱلْحَكَم", transliteration: "Al-Hakam", meaning: "The Judge",
    ayah: "Judgment belongs to Allah alone.",
    ayahRef: `Al-An'am 6:57 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Allah is the ultimate judge — His rulings are perfectly just, never erring, never influenced by emotion or self-interest.",
    contemplation: "There is an injustice you may be experiencing or have experienced. Can you bring it to Al-Hakam and trust His judgment over it?",
    themes: ["justice", "patience", "trust"]
  },
  {
    number: 30, arabic: "ٱلْعَدْل", transliteration: "Al-Adl", meaning: "The Just",
    ayah: "Your Lord is never unjust to ˹His˺ servants.",
    ayahRef: `Fussilat 41:46 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Allah's justice is absolute — not a single atom of injustice proceeds from Him. What appears unjust to us reflects the limits of our sight, not His.",
    contemplation: "Where have you felt life was unfair? Sit with Al-Adl and ask Him to show you what you cannot yet see about His wisdom in it.",
    themes: ["justice", "hardship", "trust"]
  },
  {
    number: 31, arabic: "ٱللَّطِيف", transliteration: "Al-Latif", meaning: "The Most Subtle",
    ayah: "Allah is Ever-Gracious to His servants. He provides for whoever He wills.",
    ayahRef: `Ash-Shura 42:19 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Latif reaches His servants through ways they cannot perceive — bringing good to them through paths they did not plan for.",
    contemplation: "Look back at how things unfolded in your life. Where was Al-Latif working in subtle ways you only recognized later?",
    themes: ["gratitude", "trust", "perspective"]
  },
  {
    number: 32, arabic: "ٱلْخَبِير", transliteration: "Al-Khabir", meaning: "The All-Aware",
    ayah: "He is the All-Subtle, All-Aware.",
    ayahRef: `Al-Mulk 67:14 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim distinguishes Al-Khabir from Al-Alim — Al-Khabir carries the meaning of deep, interior awareness — He knows the inner realities of all things.",
    contemplation: "He is aware of what is hidden even from yourself. Ask Al-Khabir to show you what is in your heart that you have not yet seen.",
    themes: ["self-knowledge", "muraqabah", "heart"]
  },
  {
    number: 33, arabic: "ٱلْحَلِيم", transliteration: "Al-Halim", meaning: "The Most Forbearing",
    ayah: "Know that Allah is All-Forgiving, Most Forbearing.",
    ayahRef: `Al-Baqarah 2:235 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Halim does not rush to punish — He gives His servants time and opportunity to return. His forbearance is not weakness but immense mercy.",
    contemplation: "You have sinned and He has not punished you immediately — that is Al-Halim. How does His patience toward you call you to respond?",
    themes: ["tawbah", "gratitude", "mercy"]
  },
  {
    number: 34, arabic: "ٱلْعَظِيم", transliteration: "Al-Azim", meaning: "The Greatest",
    ayah: "He is the Most High, the Greatest.",
    ayahRef: `Al-Baqarah 2:255 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Allah's greatness is beyond imagination — the greatest things in creation are to His greatness as nothing.",
    contemplation: "Sit with the sheer vastness of Allah's greatness. How small do your problems become when placed before Al-Azim?",
    themes: ["perspective", "peace", "awe"]
  },
  {
    number: 35, arabic: "ٱلْغَفُور", transliteration: "Al-Ghafur", meaning: "The All-Forgiving",
    ayah: "He is the All-Forgiving, Full of Love.",
    ayahRef: `Al-Buruj 85:14 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains that Al-Ghafur covers sins — the Arabic root ghafara means to cover, as a helmet covers the head. He does not expose what He forgives.",
    contemplation: "He has covered your sins. What would it mean to stop uncovering them yourself — to stop rehearsing your failures and accept His forgiveness?",
    themes: ["forgiveness", "tawbah", "self-compassion"]
  },
  {
    number: 36, arabic: "ٱلشَّكُور", transliteration: "Ash-Shakur", meaning: "The Most Appreciative",
    ayah: "He is truly All-Forgiving, Most Appreciative.",
    ayahRef: `Fatir 35:30 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Ash-Shakur rewards a small deed with immense reward — He multiplies it beyond what is deserved. Even a single step toward Him is met with generosity.",
    contemplation: "Every small good you do is seen and rewarded beyond its measure. What small deed can you commit to doing sincerely for His sake today?",
    themes: ["deeds", "sincerity", "hope"]
  },
  {
    number: 37, arabic: "ٱلْعَلِيّ", transliteration: "Al-Ali", meaning: "The Most High",
    ayah: "He is the Most High, the Greatest.",
    ayahRef: `Al-Baqarah 2:255 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains that Allah's elevation is absolute — above His creation in His essence, His attributes, and His sovereignty. Nothing is above Him.",
    contemplation: "When you raise your hands in dua, you are reaching toward the Most High. How does that awareness change the quality of your supplication?",
    themes: ["dua", "awe", "salah"]
  },
  {
    number: 38, arabic: "ٱلْكَبِير", transliteration: "Al-Kabir", meaning: "The All-Great",
    ayah: "Allah is truly the Most High, All-Great.",
    ayahRef: `Al-Hajj 22:62 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that true greatness admits no partner — and the heart that fills itself with Allah's greatness has no room for the greatness of anything else.",
    contemplation: "What has taken up too much space in your heart — appearing greater than it truly is? Can you place Allah's greatness next to it?",
    themes: ["tawhid", "perspective", "heart"]
  },
  {
    number: 39, arabic: "ٱلْحَفِيظ", transliteration: "Al-Hafiz", meaning: "The Vigilant Guardian",
    ayah: "Surely my Lord is a Vigilant Guardian over all things.",
    ayahRef: `Hud 11:57 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Hafiz preserves all things from perishing before their appointed time, and guards His servants from what would harm them.",
    contemplation: "You are being guarded right now. What has Allah protected you from this week that you may not have fully noticed?",
    themes: ["protection", "gratitude", "awareness"]
  },
  {
    number: 40, arabic: "ٱلْمُقِيت", transliteration: "Al-Muqit", meaning: "The Sustainer",
    ayah: "Allah is Watchful over all things.",
    ayahRef: `An-Nisa 4:85 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim explains Al-Muqit as the one who provides the exact sustenance each creation needs — not too much, not too little, at the right time.",
    contemplation: "Your need is known and met with precision. What are you striving for that might already be provided in a way you haven't recognized?",
    themes: ["rizq", "trust", "contentment"]
  },
  {
    number: 41, arabic: "ٱلْحَسِيب", transliteration: "Al-Hasib", meaning: "The Reckoner",
    ayah: "Allah is sufficient as a Reckoner.",
    ayahRef: `An-Nisa 4:6 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Hasib knows every deed precisely and will render a perfect account. Nothing is forgotten, nothing miscounted.",
    contemplation: "Your account is being kept. If your deeds were presented to you right now, what would you wish were different?",
    themes: ["muhasabah", "accountability", "akhirah"]
  },
  {
    number: 42, arabic: "ٱلْجَلِيل", transliteration: "Al-Jalil", meaning: "The Majestic",
    ayah: "Blessed is the Name of your Lord, full of Majesty and Honour.",
    ayahRef: `Ar-Rahman 55:78 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim pairs Al-Jalil with Al-Jamil — majesty and beauty. Allah possesses both the awe-inspiring and the beautiful in perfect combination.",
    contemplation: "Sit in the presence of Al-Jalil. Let yourself feel small and awed — not in fear, but in wonder. What does that smallness free you from?",
    themes: ["awe", "humility", "peace"]
  },
  {
    number: 43, arabic: "ٱلْكَرِيم", transliteration: "Al-Karim", meaning: "The Most Generous",
    ayah: "O humanity! What has made you careless about your Lord, the Most Generous?",
    ayahRef: `Al-Infitar 82:6 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Karim gives before being asked, gives more than is expected, and does not reproach the one who returns to ask again.",
    contemplation: "He gives before you ask. What need have you been hesitant to bring to Al-Karim, as if it were too small or too much?",
    themes: ["dua", "generosity", "hope"]
  },
  {
    number: 44, arabic: "ٱلرَّقِيب", transliteration: "Ar-Raqib", meaning: "The Watchful",
    ayah: "Surely Allah is ever Watchful over you.",
    ayahRef: `An-Nisa 4:1 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Ar-Raqib is ever-present — not watching from a distance but intimately aware of every moment, every thought, every breath.",
    contemplation: "He is watching you right now. Not to catch you, but because He cares. How does His watchfulness feel to you in this moment — comforting or confronting?",
    themes: ["muraqabah", "sincerity", "awareness"]
  },
  {
    number: 45, arabic: "ٱلْمُجِيب", transliteration: "Al-Mujib", meaning: "The Responsive",
    ayah: "Surely my Lord is near, ˹and˺ responsive ˹to prayers˺.",
    ayahRef: `Hud 11:61 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Mujib responds to every caller — the dua of the wronged person, the cry of the distressed, the silent need of the heart that cannot find words.",
    contemplation: "He responds to every call. When did you last feel that your dua was truly heard? What would it take to trust that it always is?",
    themes: ["dua", "trust", "hope"]
  },
  {
    number: 46, arabic: "ٱلْوَاسِع", transliteration: "Al-Wasi'", meaning: "The All-Encompassing",
    ayah: "Surely Allah is All-Encompassing, All-Knowing.",
    ayahRef: `Al-Baqarah 2:115 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim explains Al-Wasi' as the one whose knowledge, mercy, and provision have no boundary — unlimited and without end.",
    contemplation: "His mercy has no boundary. Where are you placing limits on what Allah can do for you or forgive in you?",
    themes: ["hope", "mercy", "forgiveness"]
  },
  {
    number: 47, arabic: "ٱلْحَكِيم", transliteration: "Al-Hakim", meaning: "The All-Wise",
    ayah: "Allah is Almighty, All-Wise.",
    ayahRef: `Al-Baqarah 2:228 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Hakim places everything in its perfect place — not a single decree is without wisdom, even when that wisdom is hidden from us.",
    contemplation: "There is wisdom behind what is happening in your life right now. Even if you cannot see it — can you trust that Al-Hakim has placed this exactly where it needs to be?",
    themes: ["trust", "hardship", "wisdom"]
  },
  {
    number: 48, arabic: "ٱلْوَدُود", transliteration: "Al-Wadud", meaning: "The Most Loving",
    ayah: "He is the All-Forgiving, Full of Love.",
    ayahRef: `Al-Buruj 85:14 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Wadud loves His righteous servants with a love that surpasses all human love — and He is the source of all love that exists in creation.",
    contemplation: "Allah loves you. Not because of what you have done, but because of who He is. Sit with being loved by Al-Wadud. What does that do to your heart?",
    themes: ["love", "hope", "comfort"]
  },
  {
    number: 49, arabic: "ٱلْمَجِيد", transliteration: "Al-Majid", meaning: "The All-Glorious",
    ayah: "˹He is˺ Lord of the Throne, the All-Glorious.",
    ayahRef: `Al-Buruj 85:15 · ${SRC}`,
    scholarlyNote: "Al-Ghazali pairs Al-Majid with Al-Karim — the Glorious and the Generous. His glory is not distant but reaches into creation through His generosity.",
    contemplation: "His glory surrounds you. Look around — what in creation right now reflects Al-Majid?",
    themes: ["gratitude", "awe", "creation"]
  },
  {
    number: 50, arabic: "ٱلْبَاعِث", transliteration: "Al-Ba'ith", meaning: "The Resurrector",
    ayah: "And that the Hour is ˹definitely˺ coming—there is no doubt about it—and that Allah will resurrect those in the graves.",
    ayahRef: `Al-Hajj 22:7 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes extensively on the resurrection — that just as He brings the dead earth to life with rain, He will bring the dead back to life with His command.",
    contemplation: "You will be raised before Al-Ba'ith one day. What would you want your record to look like on that day?",
    themes: ["akhirah", "accountability", "motivation"]
  },
  {
    number: 51, arabic: "ٱلشَّهِيد", transliteration: "Ash-Shahid", meaning: "The Witness",
    ayah: "But Allah bears witness to what He has revealed to you.",
    ayahRef: `An-Nisa 4:166 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Ash-Shahid witnesses everything — inner and outer, hidden and manifest. He is witness over every action at every moment.",
    contemplation: "Allah witnessed everything you did today. He was present for every moment. How does living with a Witness change how you want to act tomorrow?",
    themes: ["muraqabah", "accountability", "sincerity"]
  },
  {
    number: 52, arabic: "ٱلْحَق", transliteration: "Al-Haqq", meaning: "The Absolute Truth",
    ayah: "Allah is the Truth, and what they invoke besides Him is falsehood, and Allah is the Most High, All-Great.",
    ayahRef: `Luqman 31:30 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Haqq is the only truly real existence — everything else exists through Him and returns to Him.",
    contemplation: "Everything else will pass. Al-Haqq alone is real and permanent. What are you holding onto that is not real, not lasting?",
    themes: ["dunya", "perspective", "tawhid"]
  },
  {
    number: 53, arabic: "ٱلْوَكِيل", transliteration: "Al-Wakil", meaning: "The Trustee",
    ayah: "Allah is sufficient for us and He is the best Protector.",
    ayahRef: `Al Imran 3:173 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains that Al-Wakil handles the affairs of those who entrust themselves to Him — not passively but actively, with complete knowledge and power.",
    contemplation: "HasbunAllah wa ni'mal wakil — Allah is sufficient and what a perfect Trustee. What are you trying to handle yourself that you could hand over to Al-Wakil?",
    themes: ["tawakkul", "anxiety", "reliance"]
  },
  {
    number: 54, arabic: "ٱلْقَوِيّ", transliteration: "Al-Qawiyy", meaning: "The All-Powerful",
    ayah: "Surely Allah is the ˹sole˺ Provider—Lord of all Power, the Almighty.",
    ayahRef: `Adh-Dhariyat 51:58 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Qawiyy's strength never diminishes — He does not tire or weaken. When you feel weak, remember whose strength you can ask to borrow.",
    contemplation: "Where do you feel weak right now? Ask Al-Qawiyy to be your strength in it.",
    themes: ["weakness", "strength", "reliance"]
  },
  {
    number: 55, arabic: "ٱلْمَتِين", transliteration: "Al-Matin", meaning: "The Firm",
    ayah: "Surely Allah is the ˹sole˺ Provider—Lord of all Power, the Almighty.",
    ayahRef: `Adh-Dhariyat 51:58 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains Al-Matin as one whose strength is absolute and inexhaustible — He is a rock that does not move, a certainty that never wavers.",
    contemplation: "Everything around you may feel unstable. Al-Matin never shifts. What would it look like to anchor yourself to Him?",
    themes: ["stability", "anxiety", "trust"]
  },
  {
    number: 56, arabic: "ٱلْوَلِيّ", transliteration: "Al-Waliyy", meaning: "The Guardian",
    ayah: "Allah is the Guardian of the believers.",
    ayahRef: `Al-Baqarah 2:257 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Waliyy takes the believer as His ally — guiding them, protecting them, and being close to them in ways no human friend can replicate.",
    contemplation: "Allah has taken you as His waliyy — His close friend and ally. Do you live as someone who has the friendship of Allah?",
    themes: ["friendship", "love", "identity"]
  },
  {
    number: 57, arabic: "ٱلْحَمِيد", transliteration: "Al-Hamid", meaning: "The Praiseworthy",
    ayah: "Surely Allah is the Self-Sufficient, Praiseworthy.",
    ayahRef: `Ibrahim 14:8 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Hamid is praiseworthy in His very essence — regardless of whether creation praises Him or not. All praise flows back to Him.",
    contemplation: "Alhamdullilah — all praise belongs to Him. Spend a few moments simply praising Al-Hamid. Not asking, just praising.",
    themes: ["gratitude", "praise", "dhikr"]
  },
  {
    number: 58, arabic: "ٱلْمُحْصِي", transliteration: "Al-Muhsi", meaning: "The All-Enumerating",
    ayah: "Everything is recorded by Us in a perfect Record.",
    ayahRef: `Ya-Sin 36:12 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Muhsi counts every single thing — every leaf that falls, every breath taken, every deed performed. Nothing escapes His count.",
    contemplation: "Every good deed is counted. Every small act of worship is recorded. Does knowing that change how you approach the small deeds you might overlook?",
    themes: ["deeds", "sincerity", "akhirah"]
  },
  {
    number: 59, arabic: "ٱلْمُبْدِئ", transliteration: "Al-Mubdi'", meaning: "The Originator",
    ayah: "It is certainly He Who originates and resurrects.",
    ayahRef: `Al-Buruj 85:13 · ${SRC}`,
    scholarlyNote: "Al-Ghazali pairs Al-Mubdi' with Al-Mu'id — He who begins and He who returns. Creation started with Him and returns to Him.",
    contemplation: "You came from Allah and will return to Him. Sit with both ends of your journey. What does that complete picture do to your priorities today?",
    themes: ["akhirah", "purpose", "perspective"]
  },
  {
    number: 60, arabic: "ٱلْمُعِيد", transliteration: "Al-Mu'id", meaning: "The Restorer",
    ayah: "It is certainly He Who originates and resurrects.",
    ayahRef: `Al-Buruj 85:13 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Mu'id will restore all of creation on the Day of Resurrection — nothing is lost to Him.",
    contemplation: "What do you feel you have lost — a relationship, an opportunity, a version of yourself? Al-Mu'id restores. Bring it to Him.",
    themes: ["loss", "hope", "healing"]
  },
  {
    number: 61, arabic: "ٱلْمُحْيِي", transliteration: "Al-Muhyi", meaning: "The Giver of Life",
    ayah: "Then He will cause you to die and then bring you back to life, and then to Him you will ˹all˺ be returned.",
    ayahRef: `Al-Baqarah 2:28 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Muhyi gives life to the dead body and also to the dead heart — through faith, knowledge, and remembrance.",
    contemplation: "Is there a part of your heart that feels dead — numb, distant from Allah? Ask Al-Muhyi to revive it.",
    themes: ["heart", "revival", "hope"]
  },
  {
    number: 62, arabic: "ٱلْمُمِيت", transliteration: "Al-Mumit", meaning: "The Creator of Death",
    ayah: "˹He is the One˺ Who created death and life in order to test which of you is best in deeds.",
    ayahRef: `Al-Mulk 67:2 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that death is a mercy — it is the door through which the believer passes to what is better. Remembering death is the destroyer of pleasures.",
    contemplation: "Death will come. The Prophet ﷺ advised frequent remembrance of it. What would you do differently today if you knew your time was shorter than you thought?",
    themes: ["death", "akhirah", "motivation"]
  },
  {
    number: 63, arabic: "ٱلْحَيّ", transliteration: "Al-Hayy", meaning: "The Ever-Living",
    ayah: "Put your trust in the Ever-Living ˹God˺ Who never dies, and glorify His praises.",
    ayahRef: `Al-Furqan 25:58 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Hayy's life is unlike all other life — without beginning, without end, without need, without sleep.",
    contemplation: "Everything you rely on will die or end. Al-Hayy alone is eternal. What are you leaning on that is not Him?",
    themes: ["tawakkul", "dunya", "reliance"]
  },
  {
    number: 64, arabic: "ٱلْقَيُّوم", transliteration: "Al-Qayyum", meaning: "The All-Sustaining",
    ayah: "Allah—there is no god ˹worthy of worship˺ except Him, the Ever-Living, All-Sustaining.",
    ayahRef: `Al-Baqarah 2:255 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Qayyum sustains all of creation in every moment — if He withdrew this sustaining, everything would cease to exist instantly.",
    contemplation: "Everything is being sustained by Him right now — including you. Your next breath is Al-Qayyum. Sit with that.",
    themes: ["dependence", "gratitude", "awe"]
  },
  {
    number: 65, arabic: "ٱلْوَاجِد", transliteration: "Al-Wajid", meaning: "The Finder",
    ayah: "It guides to the Path of the Almighty, the Praiseworthy.",
    ayahRef: `Saba 34:6 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains Al-Wajid as the one who finds and obtains whatever He wills — nothing is beyond His reach or unavailable to Him.",
    contemplation: "Nothing is beyond Him to obtain for you. What have you stopped asking for because it seemed impossible?",
    themes: ["dua", "hope", "possibility"]
  },
  {
    number: 66, arabic: "ٱلْمَاجِد", transliteration: "Al-Majid", meaning: "The Noble",
    ayah: "˹He is˺ Lord of the Throne, the All-Glorious.",
    ayahRef: `Al-Buruj 85:15 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim pairs nobility with generosity — Al-Majid's glory expresses itself in how He gives to His servants.",
    contemplation: "His nobility is expressed in His giving. What has He given you today that reflects His nobility toward you?",
    themes: ["gratitude", "generosity", "awe"]
  },
  {
    number: 67, arabic: "ٱلْوَاحِد", transliteration: "Al-Wahid", meaning: "The One",
    ayah: "Your God is ˹only˺ One God. There is no god ˹worthy of worship˺ except Him—the Most Compassionate, Most Merciful.",
    ayahRef: `Al-Baqarah 2:163 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Wahid is the foundation of all faith — the absolute oneness that admits no partner, no associate, no likeness.",
    contemplation: "There is only One. Everything else is secondary. In this moment, let your heart rest in the simplicity of tawhid — there is only Allah.",
    themes: ["tawhid", "peace", "simplicity"]
  },
  {
    number: 68, arabic: "ٱلْأَحَد", transliteration: "Al-Ahad", meaning: "The Unique",
    ayah: "Say, ˹O Prophet,˺ 'He is Allah—One ˹and Indivisible˺.'",
    ayahRef: `Al-Ikhlas 112:1 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim distinguishes Al-Ahad from Al-Wahid — Al-Ahad carries absolute uniqueness, incomparability. There is nothing like Him in any way.",
    contemplation: "Qul Huwallahu Ahad. Recite it slowly. Let it fill your heart. He is unique — unlike anything you have ever known.",
    themes: ["tawhid", "dhikr", "peace"]
  },
  {
    number: 69, arabic: "ٱلصَّمَد", transliteration: "As-Samad", meaning: "The Eternal Refuge",
    ayah: "Allah—the Sustainer ˹needed by all˺.",
    ayahRef: `Al-Ikhlas 112:2 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that As-Samad is the one all creation turns to in need — the solid, permanent refuge that never runs out and never turns anyone away.",
    contemplation: "You can run to Him. As-Samad never gets tired of you coming. What are you running to other than Him when you need refuge?",
    themes: ["refuge", "reliance", "comfort"]
  },
  {
    number: 70, arabic: "ٱلْقَادِر", transliteration: "Al-Qadir", meaning: "The All-Capable",
    ayah: "Surely Allah is Most Capable of everything.",
    ayahRef: `Al-Baqarah 2:20 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Qadir's ability is without limit — He has power over all things, and nothing is difficult for Him.",
    contemplation: "What feels impossible in your life right now? Place it before Al-Qadir — the One for whom nothing is impossible.",
    themes: ["hope", "difficulty", "dua"]
  },
  {
    number: 71, arabic: "ٱلْمُقْتَدِر", transliteration: "Al-Muqtadir", meaning: "The Powerful",
    ayah: "In the presence of an All-Powerful Sovereign.",
    ayahRef: `Al-Qamar 54:55 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains Al-Muqtadir as the intensified form of Al-Qadir — His power is not only complete but exercised with perfect mastery.",
    contemplation: "He exercises His power with complete mastery over your situation. Can you rest in that?",
    themes: ["trust", "tawakkul", "peace"]
  },
  {
    number: 72, arabic: "ٱلْمُقَدِّم", transliteration: "Al-Muqaddim", meaning: "The Expediter",
    ayah: "Allah leaves whoever He wills to stray and guides whoever He wills. And He is the Almighty, All-Wise.",
    ayahRef: `Ibrahim 14:4 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim pairs Al-Muqaddim with Al-Mu'akhkhir — He advances what He wills and delays what He wills, each with perfect wisdom.",
    contemplation: "What in your life has come sooner than expected? Al-Muqaddim advanced it. How have you received what He hastened for you?",
    themes: ["wisdom", "gratitude", "timing"]
  },
  {
    number: 73, arabic: "ٱلْمُؤَخِّر", transliteration: "Al-Mu'akhkhir", meaning: "The Delayer",
    ayah: "Allah leaves whoever He wills to stray and guides whoever He wills. And He is the Almighty, All-Wise.",
    ayahRef: `Ibrahim 14:4 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that what Al-Mu'akhkhir delays is not forgotten — it is held back with wisdom until its right time arrives.",
    contemplation: "Something you want has been delayed. Al-Mu'akhkhir delayed it. Can you trust there is wisdom in the timing?",
    themes: ["patience", "wisdom", "trust"]
  },
  {
    number: 74, arabic: "ٱلْأَوَّل", transliteration: "Al-Awwal", meaning: "The First",
    ayah: "He is the First and the Last, the Most High and Most Near, and He has ˹perfect˺ knowledge of all things.",
    ayahRef: `Al-Hadid 57:3 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Awwal existed before everything — before time, before space, before creation. He was, and nothing else was.",
    contemplation: "He was before everything. Before your worries, before your past, before this world — He was. Sit with that eternity.",
    themes: ["awe", "perspective", "peace"]
  },
  {
    number: 75, arabic: "ٱلْآخِر", transliteration: "Al-Akhir", meaning: "The Last",
    ayah: "He is the First and the Last, the Most High and Most Near.",
    ayahRef: `Al-Hadid 57:3 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Akhir will remain after all of creation has ceased — He is the destination everything returns to.",
    contemplation: "He will be there at the end — of your life, of this world. What would you want to say to Al-Akhir when you meet Him?",
    themes: ["akhirah", "death", "purpose"]
  },
  {
    number: 76, arabic: "ٱلظَّاهِر", transliteration: "Az-Zahir", meaning: "The Most High",
    ayah: "He is the First and the Last, the Most High and Most Near.",
    ayahRef: `Al-Hadid 57:3 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Az-Zahir is manifest through His signs in creation — every created thing is evidence of Him.",
    contemplation: "He is manifest in everything around you. Look at something near you — how does it point to Az-Zahir?",
    themes: ["creation", "awe", "reflection"]
  },
  {
    number: 77, arabic: "ٱلْبَاطِن", transliteration: "Al-Batin", meaning: "The Most Near",
    ayah: "He is the First and the Last, the Most High and Most Near.",
    ayahRef: `Al-Hadid 57:3 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains Al-Batin as closer to creation than creation is to itself — more intimate than the self, yet hidden from sight.",
    contemplation: "He is closer to you than your jugular vein. More intimate than your own thoughts. What would it mean to truly feel that closeness?",
    themes: ["closeness", "intimacy", "muraqabah"]
  },
  {
    number: 78, arabic: "ٱلْوَالِي", transliteration: "Al-Wali", meaning: "The Governing Guardian",
    ayah: "˹True˺ protection belongs ˹only˺ to Allah—the True ˹God˺.",
    ayahRef: `Al-Kahf 18:44 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Wali governs all affairs — not a single matter in the universe proceeds without His oversight and management.",
    contemplation: "Your affairs are being managed by Al-Wali. Can you release the need to control everything and allow Him to govern?",
    themes: ["tawakkul", "control", "peace"]
  },
  {
    number: 79, arabic: "ٱلْمُتَعَالِي", transliteration: "Al-Muta'ali", meaning: "The Most Exalted",
    ayah: "˹He is the˺ Knower of the seen and unseen—the All-Great, Most Exalted.",
    ayahRef: `Ar-Ra'd 13:9 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Muta'ali is exalted above everything by His own nature — not elevated by anything external to Him.",
    contemplation: "He is above all of it — your problems, your fears, your struggles. Nothing you face is above Al-Muta'ali's ability to handle.",
    themes: ["perspective", "peace", "awe"]
  },
  {
    number: 80, arabic: "ٱلْبَرّ", transliteration: "Al-Barr", meaning: "The Source of All Good",
    ayah: "Surely He is the Most Kind, Most Merciful.",
    ayahRef: `At-Tur 52:28 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Barr is the one from whom all goodness originates and flows — no good exists except that it came from Him.",
    contemplation: "Every good thing in your life came from Al-Barr. Trace one good thing back to its source in Him. What does that journey look like?",
    themes: ["gratitude", "goodness", "reflection"]
  },
  {
    number: 81, arabic: "ٱلتَّوَّاب", transliteration: "At-Tawwab", meaning: "The Accepter of Repentance",
    ayah: "Surely He is the Accepter of Repentance, Most Merciful.",
    ayahRef: `Al-Baqarah 2:37 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that At-Tawwab turns toward His servant the moment the servant turns toward Him — not a moment is wasted. Ibn al-Qayyim says tawbah is the beginning, middle, and end of the journey.",
    contemplation: "He is waiting for you to turn back. Is there something you have been delaying tawbah on? At-Tawwab is ready to accept it now.",
    themes: ["tawbah", "forgiveness", "hope"]
  },
  {
    number: 82, arabic: "ٱلْمُنْتَقِم", transliteration: "Al-Muntaqim", meaning: "The Avenger",
    ayah: "We will certainly inflict on the wrongdoers a ˹mighty˺ punishment.",
    ayahRef: `As-Sajdah 32:22 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Muntaqim's retribution is just — not emotional, not excessive. It is the justice that creation requires.",
    contemplation: "Justice belongs to Allah. Where are you carrying anger over an injustice that you have not released to Al-Muntaqim?",
    themes: ["justice", "anger", "trust"]
  },
  {
    number: 83, arabic: "ٱلْعَفُوّ", transliteration: "Al-Afuww", meaning: "The Pardoner",
    ayah: "Allah is Ever-Pardoning, All-Forgiving.",
    ayahRef: `An-Nisa 4:99 · ${SRC}`,
    scholarlyNote: "Al-Ghazali distinguishes Al-Afuww from Al-Ghafur — Al-Ghafur covers the sin, but Al-Afuww erases it completely. It is as if it never happened.",
    contemplation: "He does not just cover your sin — He erases it entirely. Can you let it be erased? Can you stop carrying what He has already removed?",
    themes: ["forgiveness", "tawbah", "self-compassion"]
  },
  {
    number: 84, arabic: "ٱلرَّءُوف", transliteration: "Ar-Ra'uf", meaning: "The Ever-Kind",
    ayah: "Allah is Ever-Gracious and Most Merciful to humanity.",
    ayahRef: `Al-Baqarah 2:143 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Ar-Ra'uf is an intensified form of mercy — tenderness and compassion that moves toward the one in pain.",
    contemplation: "Allah's tenderness is turned toward you. In your pain, in your struggle — He is moved by it. How does that change how you carry your burden?",
    themes: ["comfort", "pain", "mercy"]
  },
  {
    number: 85, arabic: "مَالِكُ ٱلْمُلْك", transliteration: "Malik Al-Mulk", meaning: "The Owner of All Sovereignty",
    ayah: "Say, ˹O Prophet,˺ 'O Allah, Owner of all sovereignty! You give sovereignty to whoever You will.'",
    ayahRef: `Al Imran 3:26 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that all kingdoms belong to Allah — He gives and takes sovereignty as He wills, and no ruler holds power except by His permission.",
    contemplation: "Every authority answers to Malik Al-Mulk. How does knowing the true Owner of power change how you navigate the powers in your life?",
    themes: ["perspective", "sovereignty", "trust"]
  },
  {
    number: 86, arabic: "ذُو ٱلْجَلَالِ وَٱلْإِكْرَام", transliteration: "Dhul Jalali wal Ikram", meaning: "Lord of Majesty and Honour",
    ayah: "Blessed is the Name of your Lord, full of Majesty and Honour.",
    ayahRef: `Ar-Rahman 55:78 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that this Name combines the two greatest qualities — the overwhelming majesty of Allah and His boundless generosity. Both are needed to understand Him.",
    contemplation: "He is simultaneously majestic and generous — awesome and intimate. How do you hold both of those in your heart at once?",
    themes: ["awe", "love", "balance"]
  },
  {
    number: 87, arabic: "ٱلْمُقْسِط", transliteration: "Al-Muqsit", meaning: "The Just",
    ayah: "Allah bears witness that there is no god ˹worthy of worship˺ except Him—and so do the angels and the people of knowledge—the Maintainer of Justice.",
    ayahRef: `Al Imran 3:18 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Muqsit's justice is perfect — He does not wrong a single soul even by the weight of an atom.",
    contemplation: "Not a single injustice will go unaddressed before Al-Muqsit. Can you release the accounts you are keeping against others and trust His justice?",
    themes: ["justice", "anger", "forgiveness"]
  },
  {
    number: 88, arabic: "ٱلْجَامِع", transliteration: "Al-Jami'", meaning: "The Gatherer",
    ayah: "Our Lord! You will surely gather all people for a Day about which there is no doubt.",
    ayahRef: `Al Imran 3:9 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Jami' will gather all of creation on the Day of Resurrection — no one will be missing, no account will be incomplete.",
    contemplation: "Everything will be brought together before Allah. Your deeds, your intentions, your relationships — all gathered. What do you want that gathering to look like for you?",
    themes: ["akhirah", "accountability", "motivation"]
  },
  {
    number: 89, arabic: "ٱلْغَنِيّ", transliteration: "Al-Ghani", meaning: "The Self-Sufficient",
    ayah: "O humanity! It is you who stand in need of Allah, but Allah ˹alone˺ is the Self-Sufficient, Praiseworthy.",
    ayahRef: `Fatir 35:15 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Ghani needs absolutely nothing — not worship, not gratitude, not any act of creation. He gave everything from pure generosity.",
    contemplation: "You need Him completely. He needs nothing from you. And yet He calls you to worship — purely for your own benefit. What does that do to your understanding of ibadah?",
    themes: ["ibadah", "gratitude", "humility"]
  },
  {
    number: 90, arabic: "ٱلْمُغْنِي", transliteration: "Al-Mughni", meaning: "The Enricher",
    ayah: "Did He not find you poor and enrich you?",
    ayahRef: `Ad-Duha 93:8 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Mughni enriches not just with wealth but with contentment — the richest person is the one whose heart is content.",
    contemplation: "True richness is richness of the heart. Are you rich or poor in this sense right now?",
    themes: ["contentment", "rizq", "heart"]
  },
  {
    number: 91, arabic: "ٱلْمَانِع", transliteration: "Al-Mani'", meaning: "The Withholder",
    ayah: "Whatever mercy Allah opens up for people, none can withhold it.",
    ayahRef: `Fatir 35:2 · ${SRC}`,
    scholarlyNote: "Al-Ghazali explains Al-Mani' withholds what would harm — sometimes what we want is withheld because He sees what we cannot see.",
    contemplation: "Something you wanted was withheld. Al-Mani' withheld it. Can you trust there was protection in that withholding?",
    themes: ["wisdom", "patience", "trust"]
  },
  {
    number: 92, arabic: "ٱلضَّارّ", transliteration: "Ad-Darr", meaning: "The Creator of Harm",
    ayah: "If Allah touches you with harm, none can remove it except Him.",
    ayahRef: `Al-An'am 6:17 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Ad-Darr — paired with An-Nafi' — reminds us that harm and benefit both come from Allah. This destroys dependence on anything other than Him.",
    contemplation: "Harm can only reach you if He allows it. And if He allows it, it carries purpose. What difficulty in your life can you now view through this lens?",
    themes: ["hardship", "trust", "perspective"]
  },
  {
    number: 93, arabic: "ٱلنَّافِع", transliteration: "An-Nafi'", meaning: "The Creator of Good",
    ayah: "And if He touches you with good—then He is Most Capable of everything.",
    ayahRef: `Al-An'am 6:17 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that An-Nafi' is the source of all benefit — nothing benefits you except through His permission and will.",
    contemplation: "Every benefit in your life flows from An-Nafi'. What good are you attributing to yourself or others that actually came from Him?",
    themes: ["gratitude", "perspective", "tawhid"]
  },
  {
    number: 94, arabic: "ٱلنُّور", transliteration: "An-Nur", meaning: "The Light",
    ayah: "Allah is the Light of the heavens and the earth.",
    ayahRef: `An-Nur 24:35 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that An-Nur is the light by which hearts see the truth. Al-Ghazali's famous meditation on this Name fills an entire chapter of the Ihya.",
    contemplation: "He is the Light of the heavens and the earth. Where in your life is there darkness — confusion, doubt, loss of direction? Ask An-Nur to illuminate it.",
    themes: ["guidance", "clarity", "heart"]
  },
  {
    number: 95, arabic: "ٱلْهَادِي", transliteration: "Al-Hadi", meaning: "The Guide",
    ayah: "Your Lord is sufficient ˹for you˺ as a Guide and Helper.",
    ayahRef: `Al-Furqan 25:31 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Hadi guides the hearts of the believers — a guidance that is beyond external instruction, reaching the inner reality of the soul.",
    contemplation: "You need His guidance more than you need anything else. In what area of your life are you most in need of Al-Hadi's guidance right now?",
    themes: ["guidance", "direction", "dua"]
  },
  {
    number: 96, arabic: "ٱلْبَدِيع", transliteration: "Al-Badi'", meaning: "The Originator of All",
    ayah: "˹He is the˺ Originator of the heavens and the earth! When He decrees something, He just says to it 'Be!' and it is.",
    ayahRef: `Al-Baqarah 2:117 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Badi' creates without model or precedent — everything He creates is entirely new, without imitation.",
    contemplation: "He made something from nothing — including you. You are an entirely original creation. What does being uniquely made by Al-Badi' mean for how you see yourself?",
    themes: ["identity", "purpose", "creation"]
  },
  {
    number: 97, arabic: "ٱلْبَاقِي", transliteration: "Al-Baqi", meaning: "The Ever-Lasting",
    ayah: "Whatever you have will run out, but whatever Allah has is everlasting.",
    ayahRef: `An-Nahl 16:96 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that Al-Baqi alone is permanent — everything else fades. The wise person invests in what lasts with the One who lasts.",
    contemplation: "What are you investing your time and energy in that will not last? What investment in Al-Baqi can you make today?",
    themes: ["akhirah", "priorities", "dunya"]
  },
  {
    number: 98, arabic: "ٱلْوَارِث", transliteration: "Al-Warith", meaning: "The Inheritor",
    ayah: "It is certainly We Who give life and cause death, and it is We Who are the Inheritors.",
    ayahRef: `Al-Hijr 15:23 · ${SRC}`,
    scholarlyNote: "Ibn al-Qayyim writes that Al-Warith will inherit all of creation when it ends — every kingdom, every possession will return to Him who owned it all along.",
    contemplation: "You own nothing permanently. Everything returns to Al-Warith. How does that shift your attachment to the things you call yours?",
    themes: ["detachment", "dunya", "perspective"]
  },
  {
    number: 99, arabic: "ٱلصَّبُور", transliteration: "As-Sabur", meaning: "The Most Patient",
    ayah: "He is the All-Forgiving, Full of Love.",
    ayahRef: `Al-Buruj 85:14 · ${SRC}`,
    scholarlyNote: "Al-Ghazali writes that As-Sabur's patience with the disobedient is immense — He does not hasten punishment, but gives time for return. His patience is an expression of His mercy.",
    contemplation: "Allah has been patient with you — through every sin, every delay, every turning away. How does His patience with you call you to patience with yourself and others?",
    themes: ["patience", "mercy", "tawbah"]
  }
];

// Contextual name suggestion based on themes
export function suggestName(themes: string[]): AsmaEntry {
  const matches = ASMA_AL_HUSNA.filter((a) =>
    a.themes.some((t) => themes.includes(t))
  );
  if (matches.length === 0) return ASMA_AL_HUSNA[0];
  return matches[Math.floor(Math.random() * matches.length)];
}

// Suggest based on last Muhasabah session pattern
export function suggestNameFromSession(pattern: string): AsmaEntry {
  return getNameSuggestions(pattern, 1)[0]?.entry ?? ASMA_AL_HUSNA[0];
}

// ── Multi-suggestion with reasons ─────────────────────────────────────────────

export interface NameSuggestion {
  entry: AsmaEntry;
  reason: string;
}

type SuggestionRule = { test: (s: string) => boolean; themes: string[]; reason: string };

const SUGGESTION_RULES: SuggestionRule[] = [
  { test: (s) => /speech|tongue|word|talk|gossip/i.test(s),     themes: ["speech"],              reason: "For your reflection on speech" },
  { test: (s) => /gaze|eye|watch|look|screen/i.test(s),         themes: ["gaze", "muraqabah"],   reason: "For guarding the gaze and watchfulness" },
  { test: (s) => /sin|repent|tawb|guilt|shame/i.test(s),        themes: ["tawbah", "forgiveness"],reason: "For seeking forgiveness and return" },
  { test: (s) => /anxi|worry|fear|stress|overwhelm/i.test(s),   themes: ["anxiety", "trust"],    reason: "For finding stillness and tawakkul" },
  { test: (s) => /grateful|gratitude|bless|thank/i.test(s),     themes: ["gratitude"],           reason: "For deepening gratitude" },
  { test: (s) => /pride|ego|arrog|self|show/i.test(s),          themes: ["pride", "humility"],   reason: "For softening the ego" },
  { test: (s) => /time|intention|niyyah|wast|distract/i.test(s),themes: ["purpose", "akhirah"],  reason: "For aligning intention and purpose" },
  { test: (s) => /family|parent|child|relation|treat/i.test(s), themes: ["mercy", "believers"],  reason: "For mercy in your relationships" },
];

function pickUnique(themes: string[], exclude: Set<number>, n: number): AsmaEntry[] {
  const pool = ASMA_AL_HUSNA.filter(
    (a) => !exclude.has(a.number) && a.themes.some((t) => themes.includes(t))
  );
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function getNameSuggestions(pattern: string, n = 3): NameSuggestion[] {
  const results: NameSuggestion[] = [];
  const used = new Set<number>();

  // Apply matching rules first
  for (const rule of SUGGESTION_RULES) {
    if (results.length >= n) break;
    if (!rule.test(pattern)) continue;
    const picks = pickUnique(rule.themes, used, n - results.length);
    picks.forEach((entry) => { used.add(entry.number); results.push({ entry, reason: rule.reason }); });
  }

  // Pad with general/muraqabah names if needed
  if (results.length < n) {
    const fallback = pickUnique(["general", "muraqabah"], used, n - results.length);
    fallback.forEach((entry) => { used.add(entry.number); results.push({ entry, reason: "A name for contemplation" }); });
  }

  return results.slice(0, n);
}
