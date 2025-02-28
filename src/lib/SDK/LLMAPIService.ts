import type { Conversation } from "../../app";


export default abstract class LLMAPIService{
    protected abstract endpoints:{[key:string]:string};
    protected abstract chatHistory: Conversation[];
    protected abstract developerInstructions?:string;
    static ChatSummary:string = ""

    abstract promptLLM(prompt:string):Promise<{success:boolean, message:string, response:string}>;
    abstract streamLLM(prompt:string):Promise<{success:boolean, message:string, response:string}>;
    
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
}