export const START_HOUR = 8;
export const END_HOUR = 20;
export const SLOT_MINUTES = 30;
export const ROW_HEIGHT = 40; // px, her 30 dakika icin
export const TOTAL_SLOTS = (END_HOUR - START_HOUR) * (60 / SLOT_MINUTES);
export const GRID_HEIGHT = TOTAL_SLOTS * ROW_HEIGHT;

export function timeToTop(date: Date): number {
  const minutes = date.getHours() * 60 + date.getMinutes() - START_HOUR * 60;
  return (minutes / SLOT_MINUTES) * ROW_HEIGHT;
}

export function durationToHeight(start: Date, end: Date): number {
  const minutes = (end.getTime() - start.getTime()) / 60000;
  return Math.max((minutes / SLOT_MINUTES) * ROW_HEIGHT, 24); // minimum yukseklik - cok kisa randevular da okunabilsin
}

export function getHourLabels(): string[] {
  const labels: string[] = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    labels.push(`${String(h).padStart(2, "0")}:00`);
  }
  return labels;
}

export function getWeekDates(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Pazar
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    return dd;
  });
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

// Ayni gun icinde cakisan rezervasyonlari yan yana dizmek icin
// klasik "interval partitioning" algoritmasi: her rezervasyon,
// bosta olan ilk "lane"e (serit) yerlestirilir.
export function assignLanes<T extends { startTime: string; endTime: string }>(
  items: T[]
): { item: T; lane: number; totalLanes: number }[] {
  const sorted = [...items].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  const laneEndTimes: number[] = [];
  const placed: { item: T; lane: number }[] = [];

  for (const item of sorted) {
    const start = new Date(item.startTime).getTime();
    const end = new Date(item.endTime).getTime();
    let laneIndex = laneEndTimes.findIndex((endTime) => endTime <= start);
    if (laneIndex === -1) {
      laneIndex = laneEndTimes.length;
      laneEndTimes.push(end);
    } else {
      laneEndTimes[laneIndex] = end;
    }
    placed.push({ item, lane: laneIndex });
  }

  const totalLanes = laneEndTimes.length || 1;
  return placed.map((p) => ({ ...p, totalLanes }));
}
