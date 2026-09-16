const PALETTE = [
  { bg: "#FDE4E9", text: "#B23A55" },
  { bg: "#E7E9FC", text: "#3A3FA3" },
  { bg: "#DCF3E3", text: "#1F7A44" },
  { bg: "#FDEEDC", text: "#92600B" },
  { bg: "#E0F2FE", text: "#0369A1" },
  { bg: "#F3E8FF", text: "#7E22CE" },
];

export function getAvatarColor(name: string) {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
