/**
 * Gerador de CNPJ válido (com dígitos verificadores corretos).
 * Uso: dados fictícios / mock. NÃO representa um CNPJ de empresa real.
 */
import { randomDigits, withParity, type ParityOptions } from "./parity"

/**
 * Calcula um dígito verificador de CNPJ.
 * Os pesos começam em 5 (1º dígito) ou 6 (2º dígito), decrescem até 2 e
 * então voltam para 9.
 */
function checkDigit(digits: number[]): number {
  let factor = digits.length === 12 ? 5 : 6
  let sum = 0
  for (const digit of digits) {
    sum += digit * factor
    factor = factor === 2 ? 9 : factor - 1
  }
  const rest = sum % 11
  return rest < 2 ? 0 : 11 - rest
}

/** Monta os 14 dígitos de um CNPJ (12 aleatórios + 2 verificadores). */
function buildDigits(): number[] {
  const base = randomDigits(12)
  const d1 = checkDigit(base)
  const d2 = checkDigit([...base, d1])
  return [...base, d1, d2]
}

/** Aplica a máscara XX.XXX.XXX/XXXX-XX sobre 14 dígitos. */
export function formatCNPJ(raw: string): string {
  return raw.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}

export interface GenerateCNPJOptions extends ParityOptions {
  /** Retorna com máscara quando true (padrão), senão só números. */
  formatted?: boolean
}

/** Gera um CNPJ válido, respeitando a paridade pedida (se houver). */
export function generateCNPJ({
  formatted = true,
  ...parity
}: GenerateCNPJOptions = {}): string {
  const raw = withParity(buildDigits, parity).join("")
  return formatted ? formatCNPJ(raw) : raw
}
