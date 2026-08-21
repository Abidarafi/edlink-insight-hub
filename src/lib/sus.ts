import { responses, type Response } from "@/data/responses";

export const ITEM_LABELS: Record<number, string> = {
  1: "Ingin sering menggunakan EdLink",
  2: "EdLink terasa rumit/kompleks",
  3: "EdLink mudah digunakan",
  4: "Butuh bantuan teknisi untuk memakai",
  5: "Fitur EdLink terintegrasi dengan baik",
  6: "Terlalu banyak ketidakkonsistenan",
  7: "Mudah dipelajari orang lain dengan cepat",
  8: "EdLink membingungkan saat digunakan",
  9: "Merasa percaya diri menggunakan EdLink",
  10: "Perlu belajar banyak sebelum bisa memakai",
};

export type Filters = { angkatan: string; jenisKelamin: string };

export function filterData(filters: Filters): Response[] {
  return responses.filter(
    (r) =>
      (filters.angkatan === "all" || r.Angkatan === filters.angkatan) &&
      (filters.jenisKelamin === "all" || r.JenisKelamin === filters.jenisKelamin),
  );
}

export const angkatanOptions = Array.from(new Set(responses.map((r) => r.Angkatan))).sort();
export const genderOptions = Array.from(new Set(responses.map((r) => r.JenisKelamin))).sort();
export const totalResponden = responses.length;

const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

export function summary(rows: Response[]) {
  if (rows.length === 0) return { avg: 0, median: 0, max: 0, min: 0 };
  const scores = rows.map((r) => r.SkorSUS).sort((a, b) => a - b);
  const mid = Math.floor(scores.length / 2);
  const at = (i: number) => scores[i] ?? 0;
  return {
    avg: round(scores.reduce((a, b) => a + b, 0) / scores.length),
    median: round(scores.length % 2 ? at(mid) : (at(mid - 1) + at(mid)) / 2),
    max: round(at(scores.length - 1)),
    min: round(at(0)),
  };
}

export function distribution(rows: Response[], key: keyof Response, order?: string[]) {
  const counts = new Map<string, number>();
  rows.forEach((r) => {
    const v = String(r[key]);
    counts.set(v, (counts.get(v) ?? 0) + 1);
  });
  const entries = Array.from(counts.entries());
  entries.sort((a, b) => {
    if (order) {
      const ia = order.indexOf(a[0]);
      const ib = order.indexOf(b[0]);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    }
    return b[1] - a[1];
  });
  const total = rows.length || 1;
  return entries.map(([name, value]) => ({
    name,
    value,
    percent: round((value / total) * 100),
  }));
}

export function itemContributions(rows: Response[]) {
  const items = Array.from({ length: 10 }, (_, i) => {
    const key = `P${i + 1}_Kontribusi` as keyof Response;
    const avg = rows.length
      ? rows.reduce((sum, r) => sum + (r[key] as number), 0) / rows.length
      : 0;
    return { item: `P${i + 1}`, label: ITEM_LABELS[i + 1] ?? "", value: round(avg, 2) };
  });
  const overall = round(items.reduce((a, b) => a + b.value, 0) / items.length, 2);
  return {
    overall,
    items: [...items].sort((a, b) => b.value - a.value),
    belowAverage: items.filter((i) => i.value < overall).sort((a, b) => b.value - a.value),
  };
}

export type Segment = { name: string; from: number; to: number; tone: "dark" | "mid" | "light" | "warn" };

export const SCALES: { title: string; segments: Segment[] }[] = [
  {
    title: "Acceptability Range",
    segments: [
      { name: "Not Acceptable", from: 0, to: 51, tone: "warn" },
      { name: "Marginal", from: 51, to: 71, tone: "light" },
      { name: "Acceptable", from: 71, to: 100, tone: "dark" },
    ],
  },
  {
    title: "Adjective Rating",
    segments: [
      { name: "Worst Imaginable", from: 0, to: 25, tone: "warn" },
      { name: "Poor", from: 25, to: 51.7, tone: "warn" },
      { name: "OK", from: 51.7, to: 71.1, tone: "light" },
      { name: "Good", from: 71.1, to: 80.7, tone: "mid" },
      { name: "Excellent", from: 80.7, to: 90.9, tone: "dark" },
      { name: "Best Imaginable", from: 90.9, to: 100, tone: "dark" },
    ],
  },
  {
    title: "Grade Scale",
    segments: [
      { name: "F", from: 0, to: 51.7, tone: "warn" },
      { name: "D", from: 51.7, to: 62.6, tone: "warn" },
      { name: "C", from: 62.6, to: 72.5, tone: "light" },
      { name: "B", from: 72.5, to: 78.8, tone: "mid" },
      { name: "A", from: 78.8, to: 100, tone: "dark" },
    ],
  },
];

function categorize(score: number, segments: Segment[]) {
  const found = segments.find((s) => score >= s.from && score < s.to);
  return (found ?? segments[segments.length - 1])!.name;
}

export function interpret(score: number) {
  const at = (i: number) => SCALES[i]!.segments;
  return {
    acceptability: categorize(score, at(0)),
    adjective: categorize(score, at(1)),
    grade: categorize(score, at(2)),
  };
}

export function scoreDistribution(rows: Response[]) {
  const counts = new Map<number, number>();
  rows.forEach((r) => counts.set(r.SkorSUS, (counts.get(r.SkorSUS) ?? 0) + 1));
  return Array.from(counts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([score, jumlah]) => ({ score: String(score), jumlah }));
}
