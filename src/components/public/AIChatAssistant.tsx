
'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Bot, Loader2, Send, X } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { askAiAssistant } from '@/ai/flows/ask-ai-assistant';
import type { UserProfile, BusinessCard, Link as LinkType } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AIChatAssistant({
  userProfile,
  businessCard,
  links,
}: {
  userProfile: UserProfile;
  businessCard: BusinessCard;
  links: LinkType[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await askAiAssistant({
        userProfile,
        businessCard,
        links,
        question: input,
        language,
      });

      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I couldn't process that. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  const welcomeMessage = `Hello! I'm the AI assistant for ${userProfile.displayName}. How can I help you today?`;

  return (
    <div>
      {isOpen && (
        <Card className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[500px] flex flex-col shadow-2xl z-40">
          <CardHeader className='border-b'>
            <CardTitle className="flex items-center gap-2 font-headline text-lg">
              <Bot className="text-primary" />
              AI Assistant for {userProfile.displayName}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                    <div className="flex gap-2 items-start">
                        <div className="bg-primary text-primary-foreground p-2 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-sm">
                           <p>{welcomeMessage}</p>
                        </div>
                    </div>
                {messages.map((msg, index) => (
                  <div key={index} className={`flex gap-2 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                         <div className="bg-primary text-primary-foreground p-2 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                        </div>
                    )}
                    <div className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                       <ReactMarkdown className="prose prose-sm dark:prose-invert" components={{ a: ({node, ...props}) => <a className="text-primary underline" {...props} /> }}>
                          {msg.content}
                        </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2 items-start">
                    <div className="bg-primary text-primary-foreground p-2 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                    </div>
                     <div className="bg-muted p-3 rounded-lg">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                </div>
            </ScrollArea>
          </CardContent>
          <form onSubmit={handleSend} className="p-4 border-t flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full shadow-lg w-10 h-10 p-0"
        size="icon"
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </Button>
    </div>
  );
}
