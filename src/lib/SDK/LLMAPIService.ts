import type { Context, Conversation } from "../../types";
import { LLMs } from "../../types";
import EndpointChatGPT from "./LLMs/EndpointChatGPT";

export default abstract class LLMAPIService{
    protected abstract endpoints:{[key:string]:string};
    protected abstract chatHistory: Conversation[];
    protected abstract developerInstructions?:string;
    static ChatSummary:string = ""

    abstract promptLLM(prompt:string, context:Context):Promise<{success:boolean, message:string, response:string}>;
    abstract streamLLM(prompt:string, context:Context):Promise<{success:boolean, message:string, response:string}>;
    
    abstract summerize(chat:Conversation[]):Promise<{success:boolean, message:string, response:string}>

    protected updateDeveloperInsturctions(instruction:string){
        this.developerInstructions = instruction;
    }

    protected updateChatHistory(conversation:Conversation){
        this.chatHistory.push(conversation)
    }

    protected clearChatHistory(){
        this.chatHistory = []
    }

    static updateChatSummary(summary:string){
        this.ChatSummary = summary;
    }

    static getChatSummary(){
        return this.ChatSummary;
    }

    public static LLMFactory(llm:LLMs):LLMAPIService{
        switch(llm){
            case LLMs.gpt4o:
                return new EndpointChatGPT();
            default:
                throw new Error("LLM not found");
        }

    }
}