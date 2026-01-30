import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Message } from "@shared/schema";

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversation } = useQuery({
    queryKey: ["/api/conversations/active"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/conversations");
      const list = await res.json();
      if (list.length > 0) {
        const detailRes = await apiRequest("GET", `/api/conversations/${list[0].id}`);
        return detailRes.json();
      }
      const newRes = await apiRequest("POST", "/api/conversations", { title: "Chat with Poke Enviro" });
      return newRes.json();
    },
    enabled: isOpen,
  });

  const messages = conversation?.messages || [];

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversation?.id) return;
      const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Streaming handled by refetching or UI local state if needed
      }
      return queryClient.invalidateQueries({ queryKey: [`/api/conversations/${conversation.id}`] });
    },
    onSuccess: () => {
      setInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations/active"] });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || mutation.isPending) return;
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
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4" viewportRef={scrollRef}>
              <div className="flex flex-col gap-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-white/40 italic">
                      How can I help you with your environmental journey today?
                    </p>
                  </div>
                )}
                {messages.map((msg: Message, i: number) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-white/5 text-white border border-white/10"
                    )}
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
                placeholder="Ask Poke Enviro..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9"
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={!input.trim() || mutation.isPending}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
      
      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95",
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-floating-chat"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
}
