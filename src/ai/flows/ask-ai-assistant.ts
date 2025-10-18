
'use server';

/**
 * @fileOverview Provides an AI chat assistant that can answer questions based on a user's profile and links.
 *
 * - askAiAssistant - The main flow function for the AI assistant.
 * - AskAiAssistantInput - The input type for the flow.
 * - AskAiAssistantOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { BusinessCard, Link as LinkType, UserProfile, LocalizedString } from '@/lib/types';
import { getString } from '@/lib/utils';


const AskAiAssistantInputSchema = z.object({
  userProfile: z.custom<Partial<UserProfile>>().describe("The user's main profile data."),
  businessCard: z.custom<Partial<BusinessCard>>().describe("The user's business card data."),
  links: z.array(z.custom<LinkType>()).describe("A list of all links the user has on their page."),
  question: z.string().describe("The visitor's question to the assistant."),
  language: z.enum(['de', 'en']).default('en').describe("The language for the conversation."),
});
export type AskAiAssistantInput = z.infer<typeof AskAiAssistantInputSchema>;

const AskAiAssistantOutputSchema = z.object({
  answer: z.string().describe("The AI assistant's answer to the question."),
});
export type AskAiAssistantOutput = z.infer<typeof AskAiAssistantOutputSchema>;


export async function askAiAssistant(
  input: AskAiAssistantInput
): Promise<AskAiAssistantOutput> {
  return askAiAssistantFlow(input);
}


const searchLinksTool = ai.defineTool(
    {
        name: 'searchLinks',
        description: 'Searches the user\'s links based on a query to find relevant URLs, titles, or descriptions. Use this to answer questions about specific projects, content, or where to find certain information.',
        inputSchema: z.object({ query: z.string() }),
        outputSchema: z.array(z.object({
            title: z.string(),
            url: z.string(),
            description: z.string().optional(),
        })),
    },
    async (input) => {
        console.log('Searching links with query:', input.query);
        // This is a simple implementation. A real-world scenario might use embeddings or a more sophisticated search.
        // For this implementation, we will pass it in the prompt context below.
        return []; 
    }
);

const PromptInputSchema = z.object({
    displayName: z.string(),
    businessCardBio: z.string(),
    jobTitle: z.string(),
    company: z.string(),
    location: z.string(),
    email: z.string(),
    phone: z.string(),
    links: z.array(z.object({
      title: z.string(),
      url: z.string(),
      description: z.string(),
    })),
    socials: z.array(z.object({ platform: z.string(), url: z.string() })),
    question: z.string(),
    language: z.enum(['de', 'en']),
});


const prompt = ai.definePrompt({
  name: 'askAiAssistantPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: AskAiAssistantOutputSchema },
  tools: [searchLinksTool],
  prompt: `You are a friendly and professional AI assistant for {{displayName}}.
Your goal is to answer questions from visitors based on the information provided about {{displayName}}.
Answer in the same language as the user's question, which is '{{language}}'.

Here is the information you have access to:
- Name: {{displayName}}
- Bio: {{businessCardBio}}
- Job: {{jobTitle}} at {{company}}
- Location: {{location}}
- Contact: {{email}}, {{phone}}

The user has the following links on their page. Use the 'searchLinks' tool if you need to find a specific link to answer a question.
Provide direct markdown links in your answer if relevant.
Example: "You can watch my latest video on [YouTube](https://youtube.com/...)."

List of available links:
{{#each links}}
- Title: {{this.title}} (URL: {{this.url}}) - Description: {{this.description}}
{{/each}}

List of available social media profiles:
{{#each socials}}
- Platform: {{this.platform}} (URL: {{this.url}})
{{#each}}

Now, please answer this question from a visitor:
"{{{question}}}"
`,
});

const askAiAssistantFlow = ai.defineFlow(
  {
    name: 'askAiAssistantFlow',
    inputSchema: AskAiAssistantInputSchema,
    outputSchema: AskAiAssistantOutputSchema,
  },
  async (input) => {
     // A more robust tool implementation would pass the links to the tool dynamically.
     // For now, we enhance the prompt to have all the context and let the LLM synthesize the answer.
     // The tool is kept to show the LLM what it *could* do.
     
     const language = input.language || 'en';

     const preparedInput = {
        displayName: input.userProfile?.displayName || '',
        businessCardBio: getString(input.businessCard?.bio, language),
        jobTitle: getString(input.businessCard?.jobTitle, language),
        company: input.businessCard?.company || '',
        location: input.businessCard?.location || '',
        email: input.businessCard?.email || '',
        phone: input  ?.businessCard?.phone || '',
        links: input.links.map(link => ({
            title: getString(link.title, language),
            url: link.url,
            description: getString(link.description, language),
        })),
        socials: input.businessCard?.socials?.filter(s => s && s.platform && s.url).map(s => ({platform: s.platform!, url: s.url!})) || [],
        question: input.question,
        language: language,
     };

    const { output } = await prompt(preparedInput);
    return output!;
  }
);

