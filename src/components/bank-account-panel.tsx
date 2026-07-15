import { useState } from "react"
import { Copy, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { BANKS, type Bank } from "@/lib/generators/banks"
import {
  generateBankAccount,
  randomBank,
  type BankAccount,
} from "@/lib/generators/bank-account"

async function copyText(text: string, description: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success("Copiado!", { description })
  } catch {
    toast.error("Não foi possível copiar.")
  }
}

function CopyRow({
  label,
  value,
  grow = false,
}: {
  label: string
  value: string
  grow?: boolean
}) {
  return (
    <div className={`${grow ? "flex-1" : "flex-none"} p-4`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="font-mono text-lg tabular-nums break-all">
          {value}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={() => copyText(value, `${label}: ${value}`)}
          aria-label={`Copiar ${label}`}
        >
          <Copy />
        </Button>
      </div>
    </div>
  )
}

export function BankAccountPanel() {
  const [account, setAccount] = useState<BankAccount>(() =>
    generateBankAccount(randomBank()),
  )

  function handleGenerate() {
    setAccount((prev) => generateBankAccount(prev.bank))
  }

  function handleCopyAll() {
    const text = [
      `Banco: ${account.bank.code} - ${account.bank.name}`,
      `Agência: ${account.agencia}`,
      `Conta corrente: ${account.conta}`,
      `Dígito verificador: ${account.digito}`,
    ].join("\n")
    copyText(text, account.bank.name)
  }

  return (
    <Card>
      <CardContent className="flex flex-col">
        {/* Banco: único campo com select */}
        <div className="space-y-2">
          <Label>Banco</Label>
          <Combobox
            items={BANKS}
            value={account.bank}
            onValueChange={(bank) =>
              bank && setAccount((prev) => ({ ...prev, bank }))
            }
            itemToStringLabel={(bank: Bank) => `${bank.code} - ${bank.name}`}
          >
            <ComboboxInput
              placeholder="Buscar por nome ou código..."
              className="min-h-11"
            />
            <ComboboxContent>
              <ComboboxEmpty>Nenhum banco encontrado.</ComboboxEmpty>
              <ComboboxList>
                {(bank: Bank) => (
                  <ComboboxItem key={bank.code} value={bank}>
                    {bank.code} - {bank.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Dados gerados (agência / conta / dígito) */}
        <div className="mt-6 flex flex-col divide-y rounded-xl border bg-muted sm:flex-row sm:divide-x sm:divide-y-0">
          <CopyRow label="Agência" value={account.agencia} />
          <CopyRow label="Conta corrente" value={account.conta} grow />
          <CopyRow label="Dígito" value={account.digito} />
        </div>

        {/* Ações */}
        <div className="mt-4 flex gap-3">
          <Button
            size="lg"
            variant="secondary"
            className="flex-1"
            onClick={handleGenerate}
          >
            <RefreshCw />
            Gerar novamente
          </Button>
          <Button size="lg" className="flex-1" onClick={handleCopyAll}>
            <Copy />
            Copiar tudo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
