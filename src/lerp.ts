export function lerp(from: number, to: number, alpha: number): number {
  return from * (1 - alpha) + to * alpha;
}
