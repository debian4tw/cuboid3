
export function GRoundNumber (number: number, precision:number = 10000) {
  return Math.round(((number) + Number.EPSILON) * precision) / precision
}
