import { createFileRoute } from '@tanstack/react-router'
import { useChat, type UIMessage } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { LogOut } from 'lucide-react'
import { authClient } from '#/lib/auth-client.ts'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '#/components/ui/avatar.tsx'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '#/components/ai-elements/conversation.tsx'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '#/components/ai-elements/message.tsx'
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from '#/components/ai-elements/prompt-input.tsx'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger
} from '#/components/ai-elements/reasoning.tsx'

export const Route = createFileRoute('/')({ component: Home })

const EXAMPLE_PROMPTS = [
  'List the kid-friendly circuits in Apremont.',
  "What's the easiest yellow circuit close to Bas Cuvier?",
  'I have 4 hours tomorrow afternoon and want to climb 5+ to 6b on slabs — where should I go?',
  'Suggest a warm-up sector for a rainy-but-drying day.',
]

function Home() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="size-10 animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  if (!session?.user) {
    return <SignInScreen />
  }

  return <ChatScreen user={session.user} />
}

function SignInScreen() {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <img
            alt="FontBot"
            src="/logo-alpha.png"
            className="mx-auto h-40 w-auto"
          />
          <CardTitle className="text-xl">Welcome to FontBot</CardTitle>
          <CardDescription>
            Sign in to start planning your next session on the rocks of Fontainebleau.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() =>
              authClient.signIn.social({
                provider: 'github',
                callbackURL: "http://localhost:3001/"
              })
            }
          >
            <GitHubIcon className="size-4" />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

function ChatScreen({ user }: { user: SessionUser }) {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:3000/chat',
      credentials: 'include',
    }),
  })

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text.trim()
    if (!text) return
    void sendMessage({ text })
  }

  const handleSuggestion = (prompt: string) => {
    void sendMessage({ text: prompt })
  }

  const isStreaming = status === 'streaming'

  const MessageParts = ({
    message,
    isLastMessage,
    isStreaming,
  }: {
    message: UIMessage;
    isLastMessage: boolean;
    isStreaming: boolean;
  }) => {
    // Consolidate all reasoning parts into one block
    const reasoningParts = message.parts.filter(
      (part) => part.type === "reasoning"
    );
    const reasoningText = reasoningParts.map((part) => part.text).join("\n\n");
    const hasReasoning = reasoningParts.length > 0;
    // Check if reasoning is still streaming (last part is reasoning on last message)
    const lastPart = message.parts.at(-1);
    const isReasoningStreaming =
      isLastMessage && isStreaming && lastPart?.type === "reasoning";
    return (
      <>
        {hasReasoning && (
          <Reasoning className="w-full" isStreaming={isReasoningStreaming}>
            <ReasoningTrigger />
            <ReasoningContent>{reasoningText}</ReasoningContent>
          </Reasoning>
        )}
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <MessageResponse key={`${message.id}-${i}`}>
                {part.text}
              </MessageResponse>
            );
          }
          return null;
        })}
      </>
    );
  };

  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col px-4 py-3">
      <Header user={user} />

      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState>
              <img alt="FontBot" src="/logo-alpha.png" className="size-14 w-auto" />
              <div className="space-y-1">
                <h3 className="font-medium text-sm">
                  Plan your day on the rocks
                </h3>
                <p className="text-muted-foreground text-sm">
                  Ask about areas, circuits, problems, grades, or conditions in
                  the Fontainebleau forest.
                </p>
              </div>
              <div className="mt-4 grid w-full max-w-md gap-2">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSuggestion(prompt)}
                    className="rounded-md border border-border bg-background/50 px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:border-primary/40 hover:bg-background hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message, index) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  <MessageParts
                    message={message}
                    isLastMessage={index === messages.length - 1}
                    isStreaming={isStreaming}
                  />
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {error && (
        <div className="mb-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <PromptInput onSubmit={handleSubmit} className="mt-2">
        <PromptInputTextarea placeholder="Ask FontBot about Fontainebleau..." />
        <PromptInputFooter>
          <span className="text-xs text-muted-foreground">
            Press Enter to send, Shift + Enter for newline
          </span>
          <PromptInputSubmit status={status} onStop={stop} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}

function Header({ user }: { user: SessionUser }) {
  const initial = (user.name || user.email || 'U').charAt(0).toUpperCase()
  return (
    <header className="mb-3 flex items-center justify-between border-b border-border/50 pb-3">
      <div className="flex items-center gap-2">
        <img alt="FontBot" src="/title-alpha.png" className="h-10 w-auto" />
      </div>
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name ?? ''} />
          ) : null}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium text-foreground/80 sm:inline">
          {user.name ?? user.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            void authClient.signOut()
          }}
          aria-label="Sign out"
        >
          <LogOut className="size-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Sign out</span>
        </Button>
      </div>
    </header>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.28 1.2-3.08-.12-.3-.52-1.48.11-3.08 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.6.23 2.78.12 3.08.74.8 1.19 1.82 1.19 3.08 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  )
}
