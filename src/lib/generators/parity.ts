/** Utilitários de paridade compartilhados pelos geradores (CPF, CNPJ, ...). */

export type Parity = "even" | "odd"

export interface ParityOptions {
  /** Paridade exigida para o primeiro dígito. */
  startParity?: Parity
  /** Paridade exigida para o último dígito (dígito verificador final). */
  endParity?: Parity
}

export function randomDigits(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 10))
}

export function parityOf(digit: number): Parity {
  return digit % 2 === 0 ? "even" : "odd"
}

/** Verifica se o primeiro e o último dígito atendem às paridades pedidas. */
export function matchesParity(
  digits: number[],
  { startParity, endParity }: ParityOptions,
): boolean {
  if (startParity && parityOf(digits[0]) !== startParity) return false
  if (endParity && parityOf(digits[digits.length - 1]) !== endParity) return false
  return true
}

/**
 * Gera dígitos repetidamente (via `build`) até que o primeiro/último atendam
 * à paridade pedida. Usa rejection sampling — poucas iterações na média, já
 * que cada restrição corta ~50% dos casos.
 */
export function withParity(
  build: () => number[],
  options: ParityOptions,
  maxTries = 2000,
): number[] {
  let digits = build()
  for (let i = 0; i < maxTries && !matchesParity(digits, options); i++) {
    digits = build()
  }
  return digits
}
