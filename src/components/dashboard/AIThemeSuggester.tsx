
"use client";

import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { aiPoweredThemeSuggestions, AIPoweredThemeSuggestionsOutput } from '@/ai/flows/ai-powered-theme-suggestions';
import { useToast } from '@/hooks/use-toast';

export function AIThemeSuggester() {
  const [content, setContent] = useState('');
  const [style, setStyle] = useState('Minimal');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AIPoweredThemeSuggestionsOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content) {
      toast({
        title: "Content is empty",
        description: "Please describe your brand or content first.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setSuggestions(null);
    try {
      const result = await aiPoweredThemeSuggestions({ content: content, chosenStyle: style });
      setSuggestions(result);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast({
        title: "An error occurred",
        description: "Failed to get AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="ai-content">Your Content / Brand Description</Label>
        <Textarea 
          id="ai-content" 
          placeholder="e.g., A personal blog about minimalist photography and travel..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-background"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ai-style">Desired Style</Label>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger id="ai-style" className="w-[180px] bg-background">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Minimal">Minimal</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Creative">Creative</SelectItem>
            <SelectItem value="Playful">Playful</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Get Suggestions"
        )}
      </Button>

      {suggestions && (
        <div className="space-y-4 pt-4 border-t border-border mt-4">
          <h3 className="font-bold font-headline text-lg">Here are your suggestions:</h3>
          <div className="space-y-4">
             <div>
                <h4 className="font-semibold mb-2">Theme Ideas</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {suggestions.themeSuggestions.map((item, index) => (
                    <li key={`theme-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
               <div>
                <h4 className="font-semibold mb-2">Design Improvements</h4>
                 <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {suggestions.designImprovements.map((item, index) => (
                    <li key={`design-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
