import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { BankAccountPanel } from "@/components/bank-account-panel";
import { GeneratorPanel } from "@/components/generator-panel";
import { ThemeToggle } from "@/components/theme-toggle";
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
  "font-normal data-active:font-semibold data-active:bg-transparent dark:data-active:bg-transparent dark:data-active:border-transparent data-active:text-neutral-900 data-active:hover:text-neutral-900 dark:data-active:text-neutral-900 dark:data-active:hover:text-neutral-900 group-data-[variant=default]/tabs-list:data-active:shadow-none";

// Ordem das tabs, para saber a direção do deslize ao trocar.
const TAB_ORDER = ["cpf", "cnpj", "conta"];

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

  // O `overflow-hidden` (necessário para animar a altura) recorta exatamente na
  // borda do card e cortaria a sombra dele, que sangra ~8px nas laterais e
  // ~20px embaixo, e o ring de 1px, que sangra também para cima. O padding no
  // filho medido afasta essa borda de recorte e a margem negativa no pai
  // cancela o espaço extra, mantendo o layout igual.
  return (
    <div
      className="-m-8 overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
      style={{ height }}
    >
      <div ref={innerRef} className="p-8">
        {children}
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState("cpf");
  const [direction, setDirection] = useState<"left" | "right">("right");

  function handleTabChange(next: string) {
    setDirection(
      TAB_ORDER.indexOf(next) > TAB_ORDER.indexOf(tab) ? "right" : "left",
    );
    setTab(next);
  }

  // O painel que entra desliza do mesmo lado para onde a pílula das tabs vai
  // (o Base UI remonta o painel a cada troca, então o animate-in replay a
  // animação), com a mesma duração/curva do <TabsIndicator /> para os dois
  // movimentos lerem como um só.
  const panelAnim = `animate-in fade-in-0 duration-300 ease-out motion-reduce:animate-none ${
    direction === "right" ? "slide-in-from-right-6" : "slide-in-from-left-6"
  }`;

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-app-gradient p-4 lg:p-0">
      <div className="relative z-10 w-full max-w-lg space-y-6">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-medium">
            Gerador de dados teste
          </h1>
          <ThemeToggle />
        </header>

        <Tabs
          value={tab}
          onValueChange={(value) => handleTabChange(value as string)}
          className="w-full gap-4"
        >
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

      {/* Sem richColors: toasts com o fundo neutro do tema (--popover); o tipo
          (sucesso/erro) fica indicado só pelo ícone. */}
      <Toaster position="bottom-center" />
    </main>
  );
}

export default App;
