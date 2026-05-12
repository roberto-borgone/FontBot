import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TooltipProvider } from '#/components/ui/tooltip.tsx'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'FontBot — Plan your day on the rocks of Fontainebleau' },
      {
        name: 'description',
        content:
          'FontBot is your AI bouldering buddy for the forest of Fontainebleau. Ask in natural language about areas, circuits, problems, and conditions.',
      },
      { property: 'og:title', content: 'FontBot' },
      {
        property: 'og:description',
        content: 'Plan your day on the rocks of Fontainebleau.',
      },
      { property: 'og:image', content: '/logo-full.png' },
      { property: 'og:type', content: 'website' },
      { name: 'theme-color', content: '#2f6a4a' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/logo.png' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <Scripts />
      </body>
    </html>
  )
}
