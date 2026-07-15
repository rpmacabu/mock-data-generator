import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { BankAccountPanel } from "@/components/bank-account-panel";
import { GeneratorPanel } from "@/components/generator-panel";
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { formatCPF, generateCPF } from "@/lib/generators/cpf";
import { formatCNPJ, generateCNPJ } from "@/lib/generators/cnpj";
import type { ParityOptions } from "@/lib/generators/parity";

// Tab ativa: o fundo branco agora é a pílula deslizante (<TabsIndicator />), então
// aqui deixamos o fundo da própria tab transparente (senão apareceria um branco
// instantâneo, sem o deslize) e só pintamos o texto de escuro para contrastar
// com a pílula. data-active:hover mantém a fonte escura no hover.
const activeTabClass =
  "data-active:bg-transparent dark:data-active:bg-transparent dark:data-active:border-transparent data-active:text-neutral-900 data-active:hover:text-neutral-900 dark:data-active:text-neutral-900 dark:data-active:hover:text-neutral-900 group-data-[variant=default]/tabs-list:data-active:shadow-none";

// Fade-in aplicado ao painel que entra (o Base UI remonta o painel a cada troca).
const panelAnim =
  "animate-in fade-in-0 duration-200 motion-reduce:animate-none";

/**
 * Anima a altura do conteúdo ao trocar de tab (os painéis têm alturas
 * diferentes). Mede o filho com ResizeObserver e faz transition de `height`.
 */
function AnimatedHeight({ children }: { children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => setHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
      style={{ height }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

function App() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6">
      {/* Fundo: padrão de linhas diagonais bem sutil. Dá textura para o efeito
          de vidro (o backdrop-blur dos painéis desfoca as linhas por trás).
          Puramente decorativo. */}
      <div
        aria-hidden
        className="bg-diagonal-lines pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 w-full max-w-lg space-y-6">
        <header className="space-y-1 text-center">
          <h1 className="text-3xl font-medium">Mock Data Generator</h1>
        </header>

        <Tabs defaultValue="cpf" className="w-full gap-4">
          <TabsList size="lg" className="grid w-full grid-cols-3">
            <TabsIndicator />
            <TabsTrigger value="cpf" className={activeTabClass}>
              CPF
            </TabsTrigger>
            <TabsTrigger value="cnpj" className={activeTabClass}>
              CNPJ
            </TabsTrigger>
            <TabsTrigger value="conta" className={activeTabClass}>
              Conta
            </TabsTrigger>
          </TabsList>

          <AnimatedHeight>
            <TabsContent value="cpf" className={panelAnim}>
              <GeneratorPanel
                generate={(options: ParityOptions) =>
                  generateCPF({ ...options, formatted: false })
                }
                format={formatCPF}
              />
            </TabsContent>

            <TabsContent value="cnpj" className={panelAnim}>
              <GeneratorPanel
                generate={(options: ParityOptions) =>
                  generateCNPJ({ ...options, formatted: false })
                }
                format={formatCNPJ}
              />
            </TabsContent>

            <TabsContent value="conta" className={panelAnim}>
              <BankAccountPanel />
            </TabsContent>
          </AnimatedHeight>
        </Tabs>

        <footer className="text-center text-sm text-muted-foreground">
          Created by{" "}
          <a
            href="https://rpmacabu.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            rpmacabu
          </a>{" "}
          <span className="text-muted-foreground/70">· v{__APP_VERSION__}</span>
        </footer>
      </div>

      <Toaster theme="dark" position="bottom-center" richColors />
    </main>
  );
}

export default App;
