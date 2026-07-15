/**
 * Gerador de CPF válido (com dígitos verificadores corretos).
 * Uso: dados fictícios / mock. NÃO representa um CPF de pessoa real.
 */
import { randomDigits, withParity, type ParityOptions } from "./parity"

/** Calcula um dígito verificador de CPF a partir dos dígitos anteriores. */
function checkDigit(digits: number[]): number {
  const start = digits.length + 1
  const sum = digits.reduce((acc, digit, i) => acc + digit * (start - i), 0)
  const rest = sum % 11
  return rest < 2 ? 0 : 11 - rest
}

/** Monta os 11 dígitos de um CPF (9 aleatórios + 2 verificadores). */
function buildDigits(): number[] {
  const base = randomDigits(9)
  const d1 = checkDigit(base)
  const d2 = checkDigit([...base, d1])
  return [...base, d1, d2]
}

/** Aplica a máscara XXX.XXX.XXX-XX sobre 11 dígitos. */
export function formatCPF(raw: string): string {
  return raw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export interface GenerateCPFOptions extends ParityOptions {
  /** Retorna com máscara quando true (padrão), senão só números. */
  formatted?: boolean
}

/** Gera um CPF válido, respeitando a paridade pedida (se houver). */
export function generateCPF({
  formatted = true,
  ...parity
}: GenerateCPFOptions = {}): string {
  const raw = withParity(buildDigits, parity).join("")
  return formatted ? formatCPF(raw) : raw
}
