import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, User, Paperclip, Send, RefreshCw, Sparkles, BookOpen, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGoodDocChat } from "@/hooks/useGoodDocChat";

export default function AskGoodDoc() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient] = useState("GD-10321");
  const { messages, isLoading, sendMessage, clearChat } = useGoodDocChat(selectedPatient);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const recentChats = [
    "Summary of Patient GD-10014",
    "Pending Lab Results for Today",
    "Check Prescription Conflicts",
    "Vitals Trend for Priya Sharma",
    "Time Slot Availability Today",
  ];

  const suggestionPrompts = [
    {
      text: "Summarize asthma management steps in adults.",
      icon: ClipboardList,
    },
    {
      text: "Best way to explain surgery risks to a nervous patient.",
      icon: BookOpen,
    },
    {
      text: "When to suspect functional vs. organic illness?",
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      
      <div className="ml-[196px] flex-1 flex flex-col">
        <AppHeader breadcrumbs={["Ask Good Doc"]} />
        
        <div className="flex-1 flex">
          {/* Main Content Area */}
          <main className="flex-1 p-8 flex items-center">
            <div className={cn("max-w-4xl mx-auto w-full", messages.length === 0 && "flex flex-col justify-center")}>
              {/* Welcome Message or Chat History */}
              {messages.length === 0 ? (
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-normal bg-ask-gradient bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
                    <Sparkles className="h-8 w-8 text-ask-orange" />
                    hello Dr. Neha
                  </h1>
                  <p className="text-muted-foreground">
                    How can I help you with today's care plan?
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-400px)] mb-8">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex gap-3",
                          message.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ask-orange to-ask-red flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <Card
                          className={cn(
                            "p-4 max-w-[80%]",
                            message.role === "user"
                              ? "bg-ask-gradient text-white"
                              : "bg-card"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </Card>
                        {message.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              )}

              {/* Input Area */}
              <Card className="p-6 mb-8 shadow-sm">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim() && !isLoading) {
                      sendMessage(searchQuery);
                      setSearchQuery("");
                    }
                  }}
                  className="space-y-4"
                >
                  <Input
                    placeholder="Ask anything about today's care plan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isLoading}
                    className="text-base border-0 focus-visible:ring-0 shadow-none px-0"
                  />
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Patient: {selectedPatient}</span>
                      </button>
                      
                      <button
                        type="button"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Paperclip className="h-4 w-4" />
                        <span>Attach File</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="submit"
                        disabled={!searchQuery.trim() || isLoading}
                        className="bg-ask-gradient hover:opacity-90 text-white"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isLoading ? "Sending..." : "Send"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Card>

              {/* Suggestion Prompts - Only show when no messages */}
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-4 mb-6">
                  {suggestionPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        sendMessage(prompt.text);
                      }}
                      className="text-sm text-muted-foreground hover:text-ask-orange transition-colors underline-offset-4 hover:underline"
                    >
                      {prompt.text}
                    </button>
                  ))}
                </div>
              )}

              {/* Refresh Prompts */}
              <div className="flex justify-center">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Prompts</span>
                </button>
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 border-l bg-background p-6 space-y-6">
            {/* Start New Chat */}
            <Button
              onClick={clearChat}
              className="w-full bg-ask-gradient hover:opacity-90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Chat
            </Button>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Saved Questions</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
                <ClipboardList className="h-4 w-4" />
                <span>Ask Categories</span>
              </button>
            </div>

            {/* Search Chat */}
            <div>
              <Input
                placeholder="Search Chat"
                className="h-9"
              />
            </div>

            {/* Recent Chats */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">
                Recent Chats
              </h3>
              <div className="space-y-2">
                {recentChats.map((chat, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(chat)}
                    className="w-full text-left text-sm text-muted-foreground hover:text-ask-orange transition-colors"
                  >
                    {chat}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
