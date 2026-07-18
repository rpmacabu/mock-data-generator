import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"

const THEMES = [
  { value: "light", label: "Tema claro", Icon: Sun },
  { value: "dark", label: "Tema escuro", Icon: Moon },
] as const

/**
 * Alterna entre tema claro e escuro (o padrão é escuro, definido no
 * ThemeProvider em main.tsx). A escolha é persistida pelo next-themes.
 *
 * Visual copiado das tabs: trilho `glass-subtle` com uma pílula branca que
 * desliza até o item ativo. Como aqui são só dois itens de largura igual, a
 * pílula é posicionada por translate em vez das CSS vars do Base UI.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // O next-themes só sabe o tema depois de montar (lê do localStorage), então
  // antes disso renderizamos um placeholder do mesmo tamanho para não piscar
  // com a seleção errada nem deslocar o header.
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-10 w-[4.5rem]" aria-hidden />
  }

  const isDark = theme !== "light"

  return (
    <div
      role="group"
      aria-label="Tema"
      className="relative inline-flex items-center rounded-full glass-subtle p-1"
    >
      {/* Pílula deslizante — mesma cor/sombra do <TabsIndicator />. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1 left-1 z-0 size-8 rounded-full bg-white shadow-sm",
          // Mesma transição do <TabsIndicator />.
          "transition-[translate] duration-300 ease-out motion-reduce:transition-none",
          isDark ? "translate-x-8" : "translate-x-0",
        )}
      />

      {THEMES.map(({ value, label, Icon }) => {
        const active = value === (isDark ? "dark" : "light")
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={cn(
              "relative z-10 inline-flex size-8 items-center justify-center rounded-full transition-colors",
              "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring",
              "[&_svg]:size-4 [&_svg]:shrink-0",
              // A pílula é branca nos dois temas, então o ícone ativo é escuro.
              active
                ? "text-neutral-900"
                : "text-foreground/60 hover:text-foreground",
            )}
          >
            <Icon />
          </button>
        )
      })}
    </div>
  )
}
