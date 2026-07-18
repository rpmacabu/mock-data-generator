import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* enableSystem={false}: o toggle é só claro/escuro, sem opção "sistema".
        Sem `disableTransitionOnChange`: ele injeta `transition: none !important`
        global no instante da troca, o que matava o deslize da pílula do toggle. */}
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
