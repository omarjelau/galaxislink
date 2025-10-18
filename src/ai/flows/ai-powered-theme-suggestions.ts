
'use server';

/**
 * @fileOverview Provides AI-powered theme suggestions and design improvements for link pages or digital business cards.
 *
 * - aiPoweredThemeSuggestions - A function that provides theme suggestions and design improvements.
 * - AIPoweredThemeSuggestionsInput - The input type for the aiPoweredThemeSuggestions function.
 * - AIPoweredThemeSuggestionsOutput - The return type for the aiPoweredThemeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AIPoweredThemeSuggestionsInputSchema = z.object({
  content: z.string().describe('The content of the link page or digital business card.'),
  chosenStyle: z.string().describe('The user selected style.'),
});
export type AIPoweredThemeSuggestionsInput = z.infer<
  typeof AIPoweredThemeSuggestionsInputSchema
>;

const AIPoweredThemeSuggestionsOutputSchema = z.object({
  themeSuggestions: z
    .array(z.string())
    .describe('AI-powered theme suggestions based on the content.'),
  designImprovements: z
    .array(z.string())
    .describe('AI-powered design improvements based on the content and style.'),
});
export type AIPoweredThemeSuggestionsOutput = z.infer<
  typeof AIPoweredThemeSuggestionsOutputSchema
>;

export async function aiPoweredThemeSuggestions(
  input: AIPoweredThemeSuggestionsInput
): Promise<AIPoweredThemeSuggestionsOutput> {
  return aiPoweredThemeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredThemeSuggestionsPrompt',
  input: {schema: AIPoweredThemeSuggestionsInputSchema},
  output: {schema: AIPoweredThemeSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides theme suggestions and design improvements for link pages or digital business cards.

  Based on the content and chosen style, provide relevant theme suggestions and design improvements to enhance the visual appeal.

  Content: {{{content}}}
  Chosen Style: {{{chosenStyle}}}

  Format the theme suggestions and design improvements as bullet points.
  `,
});

const aiPoweredThemeSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiPoweredThemeSuggestionsFlow',
    inputSchema: AIPoweredThemeSuggestionsInputSchema,
    outputSchema: AIPoweredThemeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
