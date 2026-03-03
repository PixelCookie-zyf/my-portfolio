export interface BenchmarkEntry {
  model: string;
  score: number;
  highlighted?: boolean;
}

export interface BenchmarkCategory {
  name: string;
  entries: BenchmarkEntry[];
}

export const benchmarks: BenchmarkCategory[] = [
  {
    name: "Code Generation",
    entries: [
      { model: "My Agent", score: 87, highlighted: true },
      { model: "GPT-4o", score: 82 },
      { model: "Claude 3.5", score: 85 },
      { model: "Gemini Pro", score: 79 },
      { model: "Llama 3", score: 71 },
    ],
  },
  {
    name: "Agent Tasks",
    entries: [
      { model: "My Agent", score: 91, highlighted: true },
      { model: "GPT-4o", score: 78 },
      { model: "Claude 3.5", score: 80 },
      { model: "Gemini Pro", score: 74 },
      { model: "Llama 3", score: 62 },
    ],
  },
  {
    name: "Reasoning",
    entries: [
      { model: "My Agent", score: 83, highlighted: true },
      { model: "GPT-4o", score: 88 },
      { model: "Claude 3.5", score: 86 },
      { model: "Gemini Pro", score: 81 },
      { model: "Llama 3", score: 68 },
    ],
  },
  {
    name: "Multilingual",
    entries: [
      { model: "My Agent", score: 88, highlighted: true },
      { model: "GPT-4o", score: 85 },
      { model: "Claude 3.5", score: 80 },
      { model: "Gemini Pro", score: 83 },
      { model: "Llama 3", score: 59 },
    ],
  },
  {
    name: "Tool Use",
    entries: [
      { model: "My Agent", score: 93, highlighted: true },
      { model: "GPT-4o", score: 86 },
      { model: "Claude 3.5", score: 84 },
      { model: "Gemini Pro", score: 77 },
      { model: "Llama 3", score: 65 },
    ],
  },
  {
    name: "Planning",
    entries: [
      { model: "My Agent", score: 89, highlighted: true },
      { model: "GPT-4o", score: 83 },
      { model: "Claude 3.5", score: 81 },
      { model: "Gemini Pro", score: 76 },
      { model: "Llama 3", score: 67 },
    ],
  },
];

export const modelColors: Record<string, string> = {
  "My Agent": "#EF4444",
  "GPT-4o": "#6B7280",
  "Claude 3.5": "#9CA3AF",
  "Gemini Pro": "#4B5563",
  "Llama 3": "#D1D5DB",
};
