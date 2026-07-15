import { useLayoutEffect, useRef, useState, type ReactNode } from "react"

import { BankAccountPanel } from "@/components/bank-account-panel"
import { GeneratorPanel } from "@/components/generator-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { formatCPF, generateCPF } from "@/lib/generators/cpf"
import { formatCNPJ, generateCNPJ } from "@/lib/generators/cnpj"
import type { ParityOptions } from "@/lib/generators/parity"

// Tab ativa: fundo branco + texto escuro (sobrescreve o estilo padrão do dark).
// data-active:hover: mantém a fonte escura no hover (senão o hover:text-foreground
// do componente clareia o texto sobre o fundo branco).
const activeTabClass =
  "data-active:bg-white data-active:text-neutral-900 data-active:hover:text-neutral-900 dark:data-active:border-transparent dark:data-active:bg-white dark:data-active:text-neutral-900 dark:data-active:hover:text-neutral-900"

// Fade-in aplicado ao painel que entra (o Base UI remonta o painel a cada troca).
const panelAnim = "animate-in fade-in-0 duration-200 motion-reduce:animate-none"

/**
 * Anima a altura do conteúdo ao trocar de tab (os painéis têm alturas
 * diferentes). Mede o filho com ResizeObserver e faz transition de `height`.
 */
function AnimatedHeight({ children }: { children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>()

  useLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return
    const update = () => setHeight(el.offsetHeight)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
      style={{ height }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  )
}

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-6">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-medium">
            Gerador de CPF/CNPJ fictício
          </h1>
        </header>

        <Tabs defaultValue="cpf" className="w-full">
          <TabsList size="lg" className="grid w-full grid-cols-3">
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
          </a>
        </footer>
      </div>

      <Toaster theme="dark" position="bottom-center" richColors />
    </main>
  )
}

export default App
