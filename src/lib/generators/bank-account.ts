/**
 * Gerador de dados de conta bancária fictícios (mock).
 *
 * IMPORTANTE: o único dado "oficial" aqui é o código do banco (COMPE, ver
 * banks.ts). Agência, conta e dígito são fake. Não existe um padrão único de
 * dígito verificador de conta no Brasil — cada banco usa seu próprio algoritmo.
 * Para gerar algo plausível e consistente, calculamos o dígito por módulo 11
 * sobre agência+conta (esquema comum); o caso "letra" (10) vira 0, como a
 * própria instrução dos apps costuma pedir ("se for letra, digite 0").
 */
import { BANKS, type Bank } from "./banks"

export { BANKS, type Bank }

function randomDigits(length: number): string {
  let out = ""
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10)
  return out
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Dígito verificador por módulo 11 (pesos 2..9 da direita p/ esquerda). */
export function mod11CheckDigit(digits: string): string {
  let sum = 0
  let weight = 2
  for (let i = digits.length - 1; i >= 0; i--) {
    sum += Number(digits[i]) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  const dv = 11 - (sum % 11)
  return dv >= 10 ? "0" : String(dv)
}

export interface BankAccount {
  bank: Bank
  agencia: string
  conta: string
  digito: string
}

/** Sorteia um banco da lista oficial. */
export function randomBank(): Bank {
  return BANKS[Math.floor(Math.random() * BANKS.length)]
}

/** Gera agência (4 díg.), conta (5–8 díg.) e dígito verificador para um banco. */
export function generateBankAccount(bank: Bank): BankAccount {
  const agencia = randomDigits(4)
  const conta = randomDigits(randomInt(5, 8))
  const digito = mod11CheckDigit(agencia + conta)
  return { bank, agencia, conta, digito }
}
