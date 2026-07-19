import { useId, useState } from "react";
import { ChevronDown, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BANKS } from "@/lib/generators/banks";
import {
  generateBankAccount,
  randomBank,
  type BankAccount,
} from "@/lib/generators/bank-account";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copiado");
  } catch {
    toast.error("Não foi possível copiar.");
  }
}

function CopyRow({
  label,
  value,
  grow = false,
}: {
  label: string;
  value: string;
  grow?: boolean;
}) {
  return (
    <div className={`${grow ? "flex-2" : "flex-1"} space-y-1 min-w-0 p-3`}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-lg tabular-nums break-all">
          {value}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 hover:text-primary"
          onClick={() => copyText(value)}
          aria-label={`Copiar ${label}`}
        >
          <Copy />
        </Button>
      </div>
    </div>
  );
}

export function BankAccountPanel() {
  const selectId = useId();
  const [account, setAccount] = useState<BankAccount>(() =>
    generateBankAccount(randomBank()),
  );

  function handleGenerate() {
    // Sorteia também o banco (não reaproveita o atual).
    setAccount(generateBankAccount(randomBank()));
  }

  function handleCopyAll() {
    const text = [
      `Banco: ${account.bank.code} - ${account.bank.name}`,
      `Agência: ${account.agencia}`,
      `Conta corrente: ${account.conta}`,
      `Dígito verificador: ${account.digito}`,
    ].join("\n");
    copyText(text);
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 py-2">
        <div className="space-y-2">
          {/* Banco: <select> nativo — no celular abre o picker do sistema
              (roleta/sheet), muito melhor que popup customizado para uma lista
              de ~470 itens; no desktop, digitar o código pula para o banco
              (type-ahead nativo casa com o prefixo do label). Estilo copiado
              do ui/input.tsx para ficar idêntico aos demais campos. */}
          <Label htmlFor={selectId}>Banco</Label>
          <div className="relative">
            <select
              id={selectId}
              value={account.bank.code}
              onChange={(e) => {
                const bank = BANKS.find((b) => b.code === e.target.value);
                if (bank) setAccount((prev) => ({ ...prev, bank }));
              }}
              className="h-12 w-full appearance-none truncate rounded-lg border border-input bg-transparent pr-9 pl-2.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
            >
              {BANKS.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.code} - {bank.name}
                </option>
              ))}
            </select>
            {/* appearance-none remove a seta nativa; esta repõe no estilo do app */}
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>

        {/* Dados gerados (agência / conta / dígito) */}
        {/* Os divisores usam o mesmo hairline da borda do box que os envolve
            (glass-subtle), em vez do --border, para não destoarem. */}
        <div className="flex flex-col divide-y divide-(--glass-subtle-hairline) rounded-xl glass-subtle sm:flex-row sm:divide-x sm:divide-y-0">
          <CopyRow label="Agência" value={account.agencia} />
          <CopyRow label="Conta corrente" value={account.conta} grow />
          <CopyRow label="Dígito" value={account.digito} />
        </div>

        {/* Ações: empilhadas no mobile, lado a lado a partir de sm */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            className="sm:flex-1"
            onClick={handleGenerate}
          >
            <RefreshCw />
            Gerar novamente
          </Button>
          <Button size="lg" className="sm:flex-1" onClick={handleCopyAll}>
            <Copy />
            Copiar tudo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
