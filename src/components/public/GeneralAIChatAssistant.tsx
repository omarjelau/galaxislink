
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Bot, Loader2, Send } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { askPlatformAssistant, AskPlatformAssistantInput } from '@/ai/flows/ask-platform-assistant';
import { Part } from 'genkit';

type ChatMessage = {
    role: 'user' | 'assistant';
    content: Part[];
}

async function fetchPageContent(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) return '';
        const html = await response.text();
        // A very simple way to extract text content. A more robust solution would be needed for a real app.
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const mainContent = tempDiv.querySelector('main')?.innerText || tempDiv.innerText;
        return mainContent.replace(/\s+/g, ' ').trim();
    } catch {
        return '';
    }
}


export function GeneralAIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const [platformKnowledge, setPlatformKnowledge] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
    const fetchKnowledge = async () => {
      const urls = ['/about', '/pricing', '/community', '/shop'];
      const contentPromises = urls.map(url => fetchPageContent(new URL(url, window.location.origin).href));
      const contents = await Promise.all(contentPromises);
      setPlatformKnowledge(contents.join('\n\n---\n\n'));
    };

    fetchKnowledge();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: [{ text: question }] };
    setChatHistory(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
        const input: AskPlatformAssistantInput = {
            question,
            language,
            chatHistory,
            platformKnowledge
        }
      const result = await askPlatformAssistant(input);
      const assistantMessage: ChatMessage = { role: 'assistant', content: [{ text: result.answer }] };
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMessage: ChatMessage = { role: 'assistant', content: [{ text: "Sorry, I'm having trouble connecting. Please try again later." }] };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="h-12 w-12 rounded-full shadow-lg bg-primary/90 backdrop-blur-sm flex items-center justify-center animate-glow hover:bg-primary"
        aria-label="Toggle AI Assistant"
      >
        <Bot className="h-6 w-6 text-primary-foreground" />
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] flex flex-col h-[70vh]">
          <DialogHeader>
            <DialogTitle>GalaxisLink Assistant</DialogTitle>
          </DialogHeader>
          <div ref={chatContainerRef} className="flex-grow space-y-4 p-4 overflow-y-auto border-t border-b">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {msg.content[0].text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-muted">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <div className="w-full flex items-center gap-2">
              <Input
                placeholder="Ask about features, pricing, etc."
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
