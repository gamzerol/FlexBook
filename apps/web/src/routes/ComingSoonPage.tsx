export function ComingSoonPage({ title }: { title: string }) {
  return (
    <div>
      <p className="font-display font-semibold text-2xl text-ink mb-2">{title}</p>
      <p className="text-sm text-neutral-500">Bu bölüm ilerleyen adımlarda tamamlanacak.</p>
    </div>
  );
}
