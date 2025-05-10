
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, ChevronDown, ChevronUp, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hi there! I'm the LeadGen Assistant. How can I help you find leads today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: "user", content: input };
    setMessages(msgs => [...msgs, userMessage]);
    setInput("");
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Simulate AI response with a delay
    setTimeout(() => {
      let botResponse;
      
      if (input.toLowerCase().includes("lead") || input.toLowerCase().includes("find")) {
        botResponse = { 
          role: "bot", 
          content: "I can help you find leads across LinkedIn, Google Maps, and more! Would you like to try our platform with a free search?" 
        };
      } else if (input.toLowerCase().includes("price") || input.toLowerCase().includes("cost")) {
        botResponse = { 
          role: "bot", 
          content: "We offer plans starting at $49/month. You can check out our pricing page for more details!" 
        };
      } else if (input.toLowerCase().includes("features")) {
        botResponse = { 
          role: "bot", 
          content: "LeadGen Suite includes multi-source scraping, lead deduplication, email verification, and more. Would you like to learn more about our features?" 
        };
      } else {
        botResponse = { 
          role: "bot", 
          content: "Thanks for your message! To explore our lead generation platform, I'd recommend checking out our demo. Would you like to try it now?" 
        };
      }
      
      setMessages(msgs => [...msgs, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-leadgen-primary text-white rounded-full p-4 shadow-lg hover:bg-leadgen-primary/90 transition-all z-20"
      >
        {isOpen ? (
          <ChevronDown className="h-6 w-6" />
        ) : (
          <Bot className="h-6 w-6" />
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl border overflow-hidden transition-all duration-300 z-10 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        {/* Chat header */}
        <div className="bg-leadgen-primary text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            <span className="font-medium">LeadGen Assistant</span>
          </div>
          <button onClick={toggleChat} className="text-white/80 hover:text-white">
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Messages container */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-leadgen-primary text-white rounded-br-none"
                    : "bg-white border shadow-sm rounded-bl-none"
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.role === "user" ? (
                    <>
                      <span className="text-xs font-medium">You</span>
                      <User className="h-3 w-3 ml-1" />
                    </>
                  ) : (
                    <>
                      <Bot className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">LeadGen Assistant</span>
                    </>
                  )}
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border rounded-lg p-3 shadow-sm rounded-bl-none">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="p-2 bg-white border-t grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link to="/features">View Features</Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link to="/pricing">Pricing Plans</Link>
          </Button>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="shrink-0" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Mobile call to action */}
      <div className="md:hidden fixed bottom-24 left-6 bg-white rounded-lg shadow-lg border p-3 max-w-[calc(100%-96px)] animate-bounce-gentle">
        <div className="flex items-center">
          <ArrowRight className="h-4 w-4 mr-2 text-leadgen-primary" />
          <p className="text-xs">Chat with our AI assistant!</p>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
