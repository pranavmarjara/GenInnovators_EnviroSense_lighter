import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: chatStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/chat-status"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/chat-status");
        if (!res.ok) {
          return { available: false };
        }
        return res.json();
      } catch {
        return { available: false };
      }
    },
    enabled: isOpen,
    staleTime: 60000,
  });

  const isAvailable = chatStatus?.available ?? false;

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          history: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message");
      }

      return response.json();
    },
    onMutate: (content) => {
      setMessages((prev) => [...prev, { role: "user", content }]);
      setInput("");
    },
    onSuccess: (data) => {
      if (data.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      }
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, I encountered an error: ${error.message}` },
      ]);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || mutation.isPending || !isAvailable) return;
    mutation.mutate(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl border-primary/20 bg-black/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-xs font-bold text-primary">PE</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">Poke Enviro</h3>
                <p className="text-[10px] text-primary/70 mt-1">Environmental Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white/50 hover:text-white"
              data-testid="button-close-chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4" viewportRef={scrollRef}>
              <div className="flex flex-col gap-4">
                {statusLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary/50" />
                    <p className="text-sm text-white/40 mt-2">Checking availability...</p>
                  </div>
                ) : !isAvailable ? (
                  <div className="text-center py-8 px-4">
                    <AlertCircle className="h-8 w-8 mx-auto text-yellow-500/70 mb-3" />
                    <p className="text-sm text-white/60">
                      Poke Enviro is unavailable until a Gemini API key is configured.
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-white/40 italic">
                      How can I help you with your environmental journey today?
                    </p>
                  </div>
                ) : null}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-white/5 text-white border border-white/10"
                    )}
                    data-testid={`message-${msg.role}-${i}`}
                  >
                    {msg.content}
                  </div>
                ))}
                {mutation.isPending && (
                  <div className="bg-white/5 text-white border border-white/10 max-w-[80%] rounded-lg p-3 text-sm flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Thinking...
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="flex w-full gap-2 items-end">
              <Input
                placeholder={isAvailable ? "Ask Poke Enviro..." : "Chat unavailable"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={!isAvailable}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9 disabled:opacity-50"
                data-testid="input-chat-message"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || mutation.isPending || !isAvailable}
                className="shrink-0"
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
      <Button
        size="icon"
        className="relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground border border-white/20 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 bg-gradient-to-br from-[#e8e8e8] via-[#f5f5f5] to-[#d4d4d4] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:-translate-x-full before:animate-[shimmer_2s_infinite] before:rounded-full"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-floating-chat"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <MessageCircle className="h-6 w-6 text-gray-700" />
        )}
      </Button>
    </div>
  );
}
