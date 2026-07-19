"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-6 text-green-500" />
        ),
        info: (
          <InfoIcon className="size-6" />
        ),
        warning: (
          <TriangleAlertIcon className="size-6" />
        ),
        error: (
          <OctagonXIcon className="size-6 text-destructive" />
        ),
        loading: (
          <Loader2Icon className="size-6 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        // Formato de pílula com largura de conteúdo, centralizada. O Sonner
        // anima via `transform`, então o -translate-x-1/2 (propriedade
        // `translate` no Tailwind v4) compõe sem conflitar.
        classNames: {
          toast:
            "cn-toast !w-fit !left-1/2 !-translate-x-1/2 !rounded-full !items-center !gap-3 !px-5 !py-3",
          title: "!text-lg !font-medium !whitespace-nowrap",
          description: "!text-sm !text-muted-foreground !whitespace-nowrap",
          icon: "!size-6 !m-0 [&>svg]:!size-6",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
