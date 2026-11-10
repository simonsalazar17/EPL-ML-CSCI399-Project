export default function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="metric"><dt>{label}</dt><dd>{value}</dd><p>{detail}</p></div>;
}
