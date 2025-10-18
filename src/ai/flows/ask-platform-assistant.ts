
'use server';

/**
 * @fileOverview Provides a general-purpose AI chat assistant for the GalaxisLink platform.
 *
 * - askPlatformAssistant - The main flow function for the AI assistant.
 * - AskPlatformAssistantInput - The input type for the flow.
 * - AskPlatformAssistantOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Part } from 'genkit';

const AskPlatformAssistantInputSchema = z.object({
  question: z.string().describe("The visitor's question to the assistant."),
  language: z.enum(['de', 'en']).default('en').describe("The language for the conversation."),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.array(z.custom<Part>()),
  })).optional().describe("The previous chat history."),
  platformKnowledge: z.string().describe("A summary of the platform's features, pricing, and other relevant information extracted from the marketing pages.").optional(),
});
export type AskPlatformAssistantInput = z.infer<typeof AskPlatformAssistantInputSchema>;

const AskPlatformAssistantOutputSchema = z.object({
  answer: z.string().describe("The AI assistant's answer to the question."),
});
export type AskPlatformAssistantOutput = z.infer<typeof AskPlatformAssistantOutputSchema>;


export async function askPlatformAssistant(
  input: AskPlatformAssistantInput
): Promise<AskPlatformAssistantOutput> {
  return askPlatformAssistantFlow(input);
}


const prompt = ai.definePrompt({
  name: 'askPlatformAssistantPrompt',
  input: { schema: AskPlatformAssistantInputSchema },
  output: { schema: AskPlatformAssistantOutputSchema },
  prompt: `You are a friendly and helpful AI assistant for GalaxisLink, a platform that provides Link-in-Bio pages and digital business cards.
Your goal is to answer questions from visitors about the platform's features, pricing, and how to use it, based *only* on the information provided below.
Answer in the same language as the user's question, which is '{{language}}'.

Here is the information you have about GalaxisLink:
---
{{{platformKnowledge}}}
---

Keep your answers concise and helpful. If the information is not available in the provided text, state that you do not have the information. Do not make up answers.

{{#if chatHistory}}
This is the conversation so far:
{{#each chatHistory}}
- {{this.role}}: {{this.content.[0].text}}
{{/each}}
{{/if}}

Now, please answer this new question from a visitor:
"{{{question}}}"
`,
});

const askPlatformAssistantFlow = ai.defineFlow(
  {
    name: 'askPlatformAssistantFlow',
    inputSchema: AskPlatformAssistantInputSchema,
    outputSchema: AskPlatformAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

