import type { Context, Conversation, SummarySchema } from "../../types";
import { LLMs } from "../../types";

export default abstract class LLMAPIService{
    protected abstract endpoints:{[key:string]:string};
    static ChatSummary:string = ""

    abstract promptLLM(prompt:string, context:Context):Promise<{success:boolean, message:string, response:string}>;
    abstract streamLLM(prompt:string, context:Context):Promise<{success:boolean, message:string, response:string}>;
    
    abstract summarize(prompt:string, response:string):Promise<{success:boolean, message:string, response:SummarySchema}>



    static updateChatSummary(summary:string){
        this.ChatSummary = summary;
    }

    static getChatSummary(){
        return this.ChatSummary;
    }

    public static async LLMFactory(llm: LLMs): Promise<LLMAPIService> {
        switch (llm) {
            case LLMs.gpt4o:
                const { default: ChatGPT } = await import("./LLMs/EndpointChatGPT");
                return new ChatGPT();
            case LLMs.gemini:
                const { default: Gemini } = await import("./LLMs/EndpointGemini");
                return new Gemini();
            default:
                throw new Error("LLM not found");
        }
    }
    
}