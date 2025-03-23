import { config } from "dotenv";
import OpenAI from "openai";
import type { AutoParseableResponseFormat } from "openai/lib/parser.mjs";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export default class OpenAIService {
    private app: OpenAI;

    constructor() {
        if (process.env.NODE_ENV !== 'production') { config(); }
        this.app = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    // This method should be renamed to prompt
    public async chat(messages: ChatCompletionMessageParam[]) {
        let completion
        try{

            completion = await this.app.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    ...messages
                ]
            });
        }catch{
            completion = await this.app.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    ...messages
                ]
            });
        }
        return completion.choices[0].message.content
    }


    public async generate_embeding(input:string){
        const embedding = await this.app.embeddings.create({
            model:"text-embedding-3-large",
            input
        })
        return embedding.data[0].embedding;
    }

    public async annotate(messages: ChatCompletionMessageParam[] , response_format?:AutoParseableResponseFormat<any>){
        let completion
        try{
            completion = await this.app.beta.chat.completions.parse({
                model: "gpt-4o-2024-08-06",
                messages: [
                    ...messages
                ],
                response_format: response_format || undefined
            });
        }catch(error){

            console.error(error);
            throw new Error("Error creating anotation");
        }

        return completion.choices[0].message.parsed
    }
}
