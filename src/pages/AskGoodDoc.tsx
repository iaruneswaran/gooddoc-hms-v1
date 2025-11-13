import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, User, Paperclip, Mic, Search, RefreshCw, Sparkles, BookOpen, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AskGoodDoc() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient] = useState("GD-10321");

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
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-normal bg-ask-gradient bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="h-8 w-8 text-ask-orange" />
                  hello Dr. Neha
                </h1>
                <p className="text-muted-foreground">
                  How can I help you with today's care plan?
                </p>
              </div>

              {/* Search Input */}
              <Card className="p-6 mb-8 shadow-sm">
                <div className="space-y-4">
                  <Input
                    placeholder="Ask anything about today's care plan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-base border-0 focus-visible:ring-0 shadow-none px-0"
                  />
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <User className="h-4 w-4" />
                        <span>Patient: {selectedPatient}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Paperclip className="h-4 w-4" />
                        <span>Attach File</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Mic className="h-4 w-4" />
                      </Button>
                      
                      <Button className="bg-ask-gradient hover:opacity-90 text-white">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Suggestion Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {suggestionPrompts.map((prompt, index) => (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer hover:shadow-md transition-all hover-scale border-border"
                  >
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-foreground leading-relaxed">
                        {prompt.text}
                      </p>
                      <div className="flex justify-end">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ask-orange to-ask-red flex items-center justify-center">
                          <prompt.icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Refresh Prompts */}
              <div className="flex justify-end">
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
            <Button className="w-full bg-ask-gradient hover:opacity-90 text-white">
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
              <div className="space-y-1">
                {recentChats.map((chat, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                      "text-foreground hover:bg-accent"
                    )}
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
