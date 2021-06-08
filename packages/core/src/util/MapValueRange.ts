export function MapValueRange(val: number, sourceMin: number, sourceMax: number, targetMin: number, targetMax: number) {
  const t = (val-sourceMin)/(sourceMax-sourceMin)
  return (targetMax-targetMin)*t + targetMin
}