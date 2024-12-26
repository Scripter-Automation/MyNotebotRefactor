import { config } from "dotenv";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export default class OpenAIService {
    private app: OpenAI;

    constructor() {
        config();
        this.app = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    public async chat(messages: ChatCompletionMessageParam[], context: object) {
        const completion = await this.app.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: JSON.stringify(context)
                },
                ...messages
            ]
        });
        return completion.choices[0].message.content
    }


    public async generate_embeding(input:string){
        const embedding = await this.app.embeddings.create({
            model:"text-embedding-3-large",
            input:input
        })
        return embedding.data[0].embedding;
    }
}
