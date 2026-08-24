export type ArticleCategory =
  | "Maternal Health"
  | "Child Health"
  | "Common Illnesses"
  | "Nutrition";

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  readMinutes: number;
  summary: string;
  body: string[];
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  "Maternal Health",
  "Child Health",
  "Common Illnesses",
  "Nutrition",
];

export const articles: Article[] = [
  {
    id: "malaria-prevention",
    title: "Understanding Malaria Prevention",
    category: "Common Illnesses",
    readMinutes: 4,
    summary:
      "Simple daily habits that lower the risk of malaria for you and your family.",
    body: [
      "Malaria spreads through the bite of an infected mosquito, mostly at night.",
      "Sleep under a treated mosquito net every night, clear standing water around the compound, and keep windows screened where possible.",
      "Fever, chills, headache and body weakness can be signs of malaria. Visit a health facility for a test instead of guessing.",
    ],
  },
  {
    id: "healthy-eating",
    title: "Healthy Eating for a Strong Body",
    category: "Nutrition",
    readMinutes: 3,
    summary:
      "Balanced meals using affordable local foods you can find at the market.",
    body: [
      "A strong meal combines an energy food, a body-building food and a protective food.",
      "Beans, groundnuts, eggs and fish build the body. Vegetables and fruits protect it. Yam, rice and maize give energy.",
      "Drink clean water through the day and reduce very salty or very sugary foods.",
    ],
  },
  {
    id: "blood-pressure",
    title: "Understanding High Blood Pressure",
    category: "Common Illnesses",
    readMinutes: 5,
    summary:
      "High blood pressure often has no symptoms. Regular checks matter.",
    body: [
      "Blood pressure is the force of blood pushing against the walls of your arteries.",
      "Many people feel completely well while their blood pressure is high, so check it whenever you visit a facility.",
      "Reducing salt, staying active and taking prescribed medicine consistently helps keep it under control.",
    ],
  },
  {
    id: "maternal-basics",
    title: "Maternal Health Basics",
    category: "Maternal Health",
    readMinutes: 4,
    summary: "What to expect from antenatal visits and how to prepare safely.",
    body: [
      "Start antenatal care as early as possible in pregnancy, even when you feel well.",
      "Antenatal visits check the baby's growth, your blood level and your blood pressure.",
      "Plan the birth with a skilled health worker and agree on transport arrangements ahead of time.",
    ],
  },
  {
    id: "child-fever",
    title: "Caring for a Child With Fever",
    category: "Child Health",
    readMinutes: 3,
    summary: "How to keep a child comfortable and when to seek help quickly.",
    body: [
      "Keep the child cool, lightly dressed and drinking fluids often.",
      "Seek care immediately if the child is very young, refuses fluids, has a convulsion or is unusually weak.",
      "Do not give leftover medicine from another person or another illness.",
    ],
  },
  {
    id: "immunisation",
    title: "Keeping Immunisation on Schedule",
    category: "Child Health",
    readMinutes: 3,
    summary: "Why every dose counts and how to keep track of the card.",
    body: [
      "Immunisation protects children against diseases that spread easily in the community.",
      "Keep the immunisation card safe and bring it to every visit.",
      "If a dose is missed, visit the nearest health centre to continue the schedule rather than starting over.",
    ],
  },
];

export const HEALTH_INFO_DISCLAIMER =
  "General health information only. RuralReach Health does not diagnose or treat illness — speak to a qualified health worker.";
