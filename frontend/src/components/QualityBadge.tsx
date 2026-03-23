interface Props {
  label: string;
  score: number;
}

export default function QualityBadge({ label, score }: Props) {
  const color =
    score >= 8
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : score >= 6
        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
        : "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${color}`}
    >
      {label}
      <span className="font-bold">{score.toFixed(1)}</span>
    </span>
  );
}
