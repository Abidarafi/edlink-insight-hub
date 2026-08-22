import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import itplnLogo from "../assets/logo-itpln.png";
import edlinkLogo from "../assets/logo-edlink.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SCALES,
  angkatanOptions,
  distribution,
  filterData,
  genderOptions,
  interpret,
  itemContributions,
  scoreDistribution,
  summary,
  totalResponden,
} from "@/lib/sus";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Analisis Kemudahan Penggunaan EdLink | IT PLN" },
      {
        name: "description",
        content:
          "Dashboard analisis kemudahan penggunaan aplikasi EdLink dengan metode System Usability Scale (SUS) pada 100 mahasiswa Institut Teknologi PLN.",
      },
      { property: "og:title", content: "Analisis Kemudahan Penggunaan EdLink | IT PLN" },
      {
        property: "og:description",
        content:
          "Hasil pengukuran SUS aplikasi EdLink: skor rata-rata, distribusi interpretasi, dan area yang perlu diperbaiki.",
      },
    ],
  }),
  component: Dashboard,
});

const BRAND = "#1f7a4d";
const BRAND_DARK = "#0f4d31";
const BRAND_LIGHT = "#4fc27f";
const WARN = "#e08b1e";

const DONUT_COLORS = [
  BRAND_DARK,
  "#186b44",
  BRAND,
  "#2f9a62",
  BRAND_LIGHT,
  "#7fd6a2",
  "#a9e6c1",
  "#cdf0dc",
  "#5bb8a6",
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-4 shadow-card sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function ScoreCard({
  value,
  label,
  highlight = false,
}: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-card transition-all duration-500 sm:p-6 ${
        highlight
          ? "border-transparent bg-gradient-brand text-brand-foreground"
          : "border-border bg-card text-foreground"
      }`}
    >
      <div className="text-3xl font-bold tabular-nums transition-all duration-500 sm:text-4xl">
        {value.toFixed(1)}
      </div>
      <div
        className={`mt-1 text-xs font-medium sm:text-sm ${highlight ? "opacity-90" : "text-muted-foreground"}`}
      >
        {label}
      </div>
    </div>
  );
}


function DonutCard({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number; percent: number }[];
}) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-2 flex flex-col items-center gap-4 lg:flex-row">
        <div className="h-40 w-full sm:h-44 lg:w-40">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="58%"
                outerRadius="88%"
                paddingAngle={2}
                stroke="none"
                animationDuration={600}
              >
                {data.map((d, i) => (
                  <Cell key={d.name} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="w-full space-y-2">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
              />
              <span className="flex-1 truncate text-foreground">{d.name}</span>
              <span className="font-semibold tabular-nums text-muted-foreground">
                {d.value} · {d.percent}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

const TONE: Record<string, string> = {
  dark: BRAND_DARK,
  mid: BRAND,
  light: BRAND_LIGHT,
  warn: WARN,
};

function InterpretCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-card sm:p-6">
      <div className="text-2xl font-bold text-brand transition-all duration-500 sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{label}</div>
    </div>
  );
}

function ScalePositionChart({ avg }: { avg: number }) {
  return (
    <Card className="overflow-hidden">
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="relative min-w-[560px] px-1 pt-8">
          <div className="space-y-5">
            {SCALES.map((scale) => (
              <div key={scale.title}>
                <div className="mb-1.5 text-xs font-semibold text-muted-foreground">
                  {scale.title}
                </div>
                <div className="flex h-11 w-full overflow-hidden rounded-lg">
                  {scale.segments.map((s) => (
                    <div
                      key={s.name}
                      title={`${s.name} (${s.from}–${s.to})`}
                      className="flex items-center justify-center overflow-hidden px-1 text-[10px] font-semibold text-brand-foreground sm:text-xs"
                      style={{ width: `${s.to - s.from}%`, background: TONE[s.tone] }}
                    >
                      <span className="truncate">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="relative h-4">
              {[0, 25, 50, 75, 100].map((t) => (
                <span
                  key={t}
                  className="absolute -translate-x-1/2 text-[10px] text-muted-foreground"
                  style={{ left: `${t}%` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div
            className="pointer-events-none absolute top-8 bottom-6 border-l-2 border-dashed transition-all duration-500"
            style={{ left: `${avg}%`, borderColor: BRAND_DARK }}
          >
            <span className="absolute -top-7 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-dark px-2.5 py-1 text-[10px] font-semibold text-brand-foreground">
              Rata-rata Skor ({avg.toFixed(1).replace(".", ",")})
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}



function ResponsesTable({ rows }: { rows: import("@/data/responses").Response[] }) {
  const [page, setPage] = useState(0);
  const perPage = 10;
  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  const current = Math.min(page, pages - 1);
  const slice = rows.slice(current * perPage, current * perPage + perPage);
  const start = rows.length === 0 ? 0 : current * perPage + 1;
  const end = Math.min(rows.length, (current + 1) * perPage);

  return (
    <Card className="overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-[11px] sm:text-xs">
          <thead>
            <tr className="bg-gradient-brand text-brand-foreground">
              <th className="sticky left-0 z-10 whitespace-nowrap bg-brand-dark px-2 py-3 text-left font-semibold sm:px-3">
                No
              </th>
              <th className="sticky left-[44px] z-10 whitespace-nowrap bg-brand-dark px-2 py-3 text-left font-semibold sm:px-3">
                NIM
              </th>
              {["Jenis Kelamin", "Angkatan"].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-2 py-3 text-left font-semibold sm:px-3"
                >
                  {h}
                </th>
              ))}
              {Array.from({ length: 10 }, (_, i) => (
                <th key={i} className="px-1.5 py-3 text-center font-semibold sm:px-2">
                  P{i + 1}
                </th>
              ))}
              <th className="px-2 py-3 text-center font-semibold sm:px-3">Skor Kontribusi</th>
              <th className="px-2 py-3 text-center font-semibold sm:px-3">Skor SUS</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r, i) => {
              const stickyBg = i % 2 === 1 ? "bg-[oklch(0.968_0.007_247.896)]" : "bg-card";
              return (
                <tr key={r.Nim} className={i % 2 === 1 ? "bg-muted/40" : ""}>
                  <td
                    className={`sticky left-0 z-10 px-2 py-1.5 text-muted-foreground sm:px-3 sm:py-2 ${stickyBg}`}
                  >
                    {start + i}
                  </td>
                  <td
                    className={`sticky left-[44px] z-10 whitespace-nowrap px-2 py-1.5 font-medium text-foreground sm:px-3 sm:py-2 ${stickyBg}`}
                  >
                    {r.Nim}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-foreground sm:px-3 sm:py-2">
                    {r.JenisKelamin}
                  </td>
                  <td className="px-2 py-1.5 text-foreground sm:px-3 sm:py-2">{r.Angkatan}</td>
                  {Array.from({ length: 10 }, (_, k) => (
                    <td
                      key={k}
                      className="px-1.5 py-1.5 text-center tabular-nums text-foreground sm:px-2 sm:py-2"
                    >
                      {r[`P${k + 1}` as keyof typeof r] as number}
                    </td>
                  ))}
                  <td className="px-2 py-1.5 text-center font-semibold tabular-nums text-foreground sm:px-3 sm:py-2">
                    {r.SkorKontribusi}
                  </td>
                  <td className="px-2 py-1.5 text-center font-bold tabular-nums text-brand sm:px-3 sm:py-2">
                    {r.SkorSUS}
                  </td>
                </tr>
              );
            })}
            {slice.length === 0 && (
              <tr>
                <td colSpan={16} className="px-3 py-6 text-center text-muted-foreground">
                  Tidak ada data pada filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center gap-2 border-t border-border px-4 py-3 sm:flex-row sm:justify-between sm:gap-3">
        <span className="text-xs text-muted-foreground">
          {start}-{end} dari {rows.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage(Math.max(0, current - 1))}
            disabled={current === 0}
            className="min-h-11 rounded-lg border border-border px-4 text-xs font-medium text-foreground disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <span className="px-1 text-xs text-muted-foreground">
            {current + 1} / {pages}
          </span>
          <button
            type="button"
            onClick={() => setPage(Math.min(pages - 1, current + 1))}
            disabled={current >= pages - 1}
            className="min-h-11 rounded-lg border border-border px-4 text-xs font-medium text-foreground disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </Card>
  );
}


function Dashboard() {
  const [angkatan, setAngkatan] = useState("all");
  const [jenisKelamin, setJenisKelamin] = useState("all");

  const rows = useMemo(() => filterData({ angkatan, jenisKelamin }), [angkatan, jenisKelamin]);
  const stats = useMemo(() => summary(rows), [rows]);
  const acceptability = useMemo(
    () => distribution(rows, "Acceptability", ["Acceptable", "Marginal", "Not Acceptable"]),
    [rows],
  );
  const grade = useMemo(
    () => distribution(rows, "GradeScale", ["A+", "A", "A-", "B+", "B", "B-", "C", "D", "F"]),
    [rows],
  );
  const adjective = useMemo(
    () =>
      distribution(rows, "AdjectiveRating", [
        "Best Imaginable",
        "Excellent",
        "Good",
        "OK",
        "Poor",
        "Worst Imaginable",
      ]),
    [rows],
  );
  const contrib = useMemo(() => itemContributions(rows), [rows]);
  const overallInterpret = useMemo(() => interpret(stats.avg), [stats.avg]);
  const susDist = useMemo(() => scoreDistribution(rows), [rows]);
  const genderDist = useMemo(() => distribution(rows, "JenisKelamin"), [rows]);
  const angkatanDist = useMemo(
    () =>
      distribution(rows, "Angkatan", ["2022", "2023", "2024", "2025"]).sort(
        (a, b) => Number(a.name) - Number(b.name),
      ),
    [rows],
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-gradient-brand text-brand-foreground">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-6">
          <img
            src={itplnLogo}
            alt="Logo Institut Teknologi PLN"
            className="h-12 w-auto rounded-md bg-white/95 p-1.5 sm:h-14"
          />
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold leading-tight sm:text-2xl">
              Sistem Informasi Analisis Kemudahan Penggunaan Aplikasi EdLink
            </h1>
            <p className="mt-1 text-sm font-medium opacity-95 sm:text-base">
              Institut Teknologi PLN
            </p>
            <p className="mt-2 text-xs opacity-85 sm:text-sm">
              Berdasarkan Metode System Usability Scale (SUS) — 100 Responden Mahasiswa Institut
              Teknologi PLN
            </p>
          </div>
          <img
            src={edlinkLogo}
            alt="Logo EdLink"
            className="h-12 w-auto rounded-md bg-white/95 p-1.5 sm:h-14"
          />
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Angkatan</label>
            <Select value={angkatan} onValueChange={setAngkatan}>
              <SelectTrigger className="h-9 w-36 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Angkatan</SelectItem>
                {angkatanOptions.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Jenis Kelamin</label>
            <Select value={jenisKelamin} onValueChange={setJenisKelamin}>
              <SelectTrigger className="h-9 w-40 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {genderOptions.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto rounded-full bg-brand/10 px-4 py-1.5 text-sm font-semibold text-brand-dark transition-all duration-300">
            {rows.length} dari {totalResponden} responden
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-10 px-6 py-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ScoreCard value={stats.avg} label="Rata-rata Skor SUS" highlight />
          <ScoreCard value={stats.median} label="Median Skor" />
          <ScoreCard value={stats.max} label="Skor Tertinggi" />
          <ScoreCard value={stats.min} label="Skor Terendah" />
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <InterpretCard value={overallInterpret.acceptability} label="Acceptability Range" />
          <InterpretCard value={overallInterpret.grade} label="Grade Scale" />
          <InterpretCard value={overallInterpret.adjective} label="Adjective Rating" />
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground">Posisi Skor pada Skala Interpretasi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Posisi rata-rata skor SUS pada rentang tiga skala interpretasi
          </p>
          <div className="mt-5">
            <ScalePositionChart avg={stats.avg} />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground">Distribusi Kategori Interpretasi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sebaran responden pada tiga skala interpretasi hasil SUS
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <DonutCard title="Acceptability" data={acceptability} />
            <DonutCard title="Grade Scale" data={grade} />
            <DonutCard title="Adjective Rating" data={adjective} />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground">Distribusi Skor SUS</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Frekuensi responden pada tiap nilai skor SUS
          </p>
          <Card className="mt-5">
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={susDist} margin={{ top: 24, right: 8, left: 0, bottom: 8 }}>
                  <XAxis
                    dataKey="score"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    formatter={(v: number) => [v, "Responden"]}
                    labelFormatter={(l: string) => `Skor SUS ${l}`}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="jumlah" fill={BRAND} radius={[8, 8, 0, 0]} animationDuration={600}>
                    <LabelList
                      dataKey="jumlah"
                      position="top"
                      style={{ fontSize: 11, fill: BRAND_DARK, fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>



        <section>
          <h2 className="text-xl font-bold text-foreground">
            Rata-Rata Skor Kontribusi per Item Pernyataan SUS (Skala 0–4)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Garis putus-putus menandai rata-rata keseluruhan ({contrib.overall.toFixed(2)})
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contrib.items}
                    layout="vertical"
                    margin={{ left: 8, right: 32, top: 8, bottom: 8 }}
                  >
                    <XAxis
                      type="number"
                      domain={[0, 4]}
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="item"
                      width={40}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "var(--foreground)" }}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--muted)" }}
                      formatter={(v: number) => [v.toFixed(2), "Skor kontribusi"]}
                      labelFormatter={(l: string) =>
                        `${l} — ${contrib.items.find((i) => i.item === l)?.label ?? ""}`
                      }
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        fontSize: 12,
                      }}
                    />
                    <ReferenceLine
                      x={contrib.overall}
                      stroke={BRAND_DARK}
                      strokeDasharray="6 6"
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={600}>
                      {contrib.items.map((d) => (
                        <Cell
                          key={d.item}
                          fill={d.value >= contrib.overall ? BRAND : WARN}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-foreground">Area Perlu Perbaikan</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Item dengan skor kontribusi di bawah rata-rata
              </p>
              <ul className="mt-4 space-y-3">
                {contrib.belowAverage.map((d) => (
                  <li
                    key={d.item}
                    className="flex items-start gap-3 rounded-xl bg-warn-soft p-3 transition-all duration-300"
                  >
                    <span className="rounded-lg bg-warn px-2 py-1 text-xs font-bold text-brand-foreground">
                      {d.item}
                    </span>
                    <span className="flex-1 text-xs leading-snug text-foreground">{d.label}</span>
                    <span className="text-sm font-bold tabular-nums text-warn">
                      {d.value.toFixed(2)}
                    </span>
                  </li>
                ))}
                {contrib.belowAverage.length === 0 && (
                  <li className="text-xs text-muted-foreground">
                    Tidak ada item di bawah rata-rata pada filter ini.
                  </li>
                )}
              </ul>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground">Karakteristik Responden</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Profil responden berdasarkan filter aktif
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-transparent bg-gradient-brand p-6 text-brand-foreground shadow-card">
              <div className="text-5xl font-bold tabular-nums">{rows.length}</div>
              <div className="mt-1 text-sm font-medium opacity-90">Total Responden</div>
            </div>
            <DonutCard title="Jenis Kelamin Responden" data={genderDist} />
            <Card>
              <h3 className="text-sm font-semibold text-foreground">Distribusi Angkatan Responden</h3>
              <div className="mt-2 h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={angkatanDist} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      width={28}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--muted)" }}
                      formatter={(v: number) => [v, "Responden"]}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="value" fill={BRAND} radius={[8, 8, 0, 0]} animationDuration={600}>
                      <LabelList
                        dataKey="value"
                        position="top"
                        style={{ fontSize: 11, fill: BRAND_DARK, fontWeight: 600 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground">Tabulasi Data Responden</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Skor Likert mentah (P1–P10), skor kontribusi, dan skor SUS tiap responden
          </p>
          <div className="mt-5">
            <ResponsesTable rows={rows} />
          </div>
        </section>
      </main>


      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Institut Teknologi PLN — Analisis System Usability Scale aplikasi EdLink
      </footer>
    </div>
  );
}
