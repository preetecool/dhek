"use client";

import { PageHeader } from "@/components/page-header";
import { AnchoredToastProvider } from "@/components/ui/toast";
import { useNotepadUrlState } from "@/hooks/use-notepad-url-state";
import { cn } from "@/lib/utils";

export function Notepad() {
  const { data, setText, setName, isLoading, shareUrl } = useNotepadUrlState();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <AnchoredToastProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <PageHeader
          defaultName="Notepad"
          maxWidth
          name={data.name}
          onNameChange={setName}
          shareUrl={shareUrl}
        />
        <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-1">
          <textarea
            className={cn(
              "min-h-0 w-full flex-1 resize-none bg-transparent pt-12 pr-4 pb-4 text-lg",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none"
            )}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your notes here..."
            value={data.text}
          />
        </main>
      </div>
    </AnchoredToastProvider>
  );
}
