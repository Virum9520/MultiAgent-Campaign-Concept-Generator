interface Props {
  label: string;
  score: number;
}

export default function QualityBadge({ label, score }: Props) {
  const color =
    score >= 8
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
      : score >= 6
        ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
        : "bg-red-500/10 text-red-400 border-red-500/25";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-mono font-medium ${color}`}
    >
      <span className="uppercase tracking-wider">{label}</span>
      <span className="font-bold">{score.toFixed(1)}</span>
    </span>
  );
}
