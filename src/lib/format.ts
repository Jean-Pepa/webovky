export function formatCZK(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

export function withVat(value: number, rate = 0.21): number {
  return Math.round(value * (1 + rate));
}
