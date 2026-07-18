import { useId, useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Parity, ParityOptions } from "@/lib/generators/parity";

/** Combinações de paridade (início × final) oferecidas no toggle. */
const PARITY_COMBOS: {
  key: string;
  label: string;
  start: Parity;
  end: Parity;
}[] = [
  { key: "even-even", label: "Par / Par", start: "even", end: "even" },
  { key: "odd-odd", label: "Ímpar / Ímpar", start: "odd", end: "odd" },
  { key: "even-odd", label: "Par / Ímpar", start: "even", end: "odd" },
  { key: "odd-even", label: "Ímpar / Par", start: "odd", end: "even" },
];

/** Combinação pré-selecionada ao abrir. */
const DEFAULT_PARITY = "even-even";

function parityOptionsFor(comboKey: string | undefined): ParityOptions {
  const combo = PARITY_COMBOS.find((c) => c.key === comboKey);
  return combo ? { startParity: combo.start, endParity: combo.end } : {};
}

interface GeneratorPanelProps {
  /** Gera um valor cru (só dígitos) respeitando a paridade pedida. */
  generate: (options: ParityOptions) => string;
  /** Aplica a máscara sobre o valor cru. */
  format: (raw: string) => string;
}

export function GeneratorPanel({ generate, format }: GeneratorPanelProps) {
  const switchId = useId();
  // Seleção do toggle de paridade: array vazio = sem restrição (Base UI).
  const [parity, setParity] = useState<string[]>([DEFAULT_PARITY]);
  const [formatted, setFormatted] = useState(false); // padrão: só números
  const [raw, setRaw] = useState(() =>
    generate(parityOptionsFor(DEFAULT_PARITY)),
  );

  const display = formatted ? format(raw) : raw;

  function handleGenerate() {
    setRaw(generate(parityOptionsFor(parity[0])));
  }

  function handleParityChange(next: string[]) {
    setParity(next);
    setRaw(generate(parityOptionsFor(next[0])));
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(display);
      toast.success("Copiado!", { description: display });
    } catch {
      toast.error("Não foi possível copiar automaticamente.");
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col">
        {/* Número gerado, com o toggle "Formatado" dentro do mesmo box */}
        <div className="rounded-lg glass-subtle px-6 pt-6 pb-5">
          <output className="block break-all select-all text-center font-mono text-2xl font-medium tracking-wider tabular-nums sm:text-3xl">
            {display}
          </output>

          <div className="mt-3 flex items-center justify-center gap-3">
            <Switch
              id={switchId}
              size="sm"
              checked={formatted}
              onCheckedChange={setFormatted}
            />
            <Label
              htmlFor={switchId}
              className="text-base font-medium text-muted-foreground"
            >
              Formatado
            </Label>
          </div>
        </div>

        {/* Ações (fora do box, como no painel de Conta) */}
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
          <Button size="lg" className="flex-1" onClick={handleCopy}>
            <Copy />
            Copiar
          </Button>
        </div>

        {/* Paridade (início × final) em linha */}
        <div className="mt-6 space-y-3">
          <span className="block text-sm text-muted-foreground">
            Início / Final
          </span>
          <ToggleGroup
            value={parity}
            onValueChange={handleParityChange}
            size="lg"
            variant="outline"
            className="grid w-full grid-cols-2 gap-2 sm:flex"
          >
            {PARITY_COMBOS.map((combo) => (
              <ToggleGroupItem
                key={combo.key}
                value={combo.key}
                className="min-w-0 px-2 text-center sm:flex-1"
              >
                {combo.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
}
