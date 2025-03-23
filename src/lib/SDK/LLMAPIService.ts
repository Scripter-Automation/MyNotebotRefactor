import StorageService, { TimeFrame } from "$lib/Services/Client/StorageService";
import { ContextMemory, ContextSummary } from "../../store";
import type { Context, Conversation, Memory, MemorySchema, SummaryContext, SummarySchema } from "../../types";
import { LLMs } from "../../types";
import type { NoteContext } from "../../zodTypes";

export default abstract class LLMAPIService{
    protected abstract endpoints:{[key:string]:string};
    protected static storage_service = new StorageService();
    static ChatSummary:SummaryContext = this.storage_service.get("summary")?.summary || {title:"", object_type:"summary", memory:""};
    static ChatMemory:MemorySchema =  this.storage_service.get("memory")?.memory || {};

    abstract promptLLM(prompt:string, context:Context):Promise<{success:boolean, message:string, response:string, embeding:number[]}>;
    abstract streamLLM(prompt:string, context:Context):Promise<{success:boolean, message:string, response:string}>;
    
    abstract summarize(prompt:string, response:string):Promise<{success:boolean, message:string, response:SummarySchema}>
    abstract memorize(prompt:string, response:string, memory:{topVector:Memory, topScore:number}):Promise<{success:boolean, message:string, response:Memory}>
    abstract annotate(memory:Memory, currentNote:any):Promise<{success:boolean, message:string, response:NoteContext}>
    

    static updateChatSummary(summary:string){
        ContextSummary.set({title:"Memoria de corto plazo", object_type:"summary", memory:summary} as SummaryContext);
        this.ChatSummary = {title:"Memoria de corto plazo", object_type:"summary", memory:summary};
        this.storage_service.store("summary", {summary:this.ChatSummary, expiration:this.storage_service.createExpiration(TimeFrame.Day, 1)})
    }

    static getChatSummary(){
        return this.ChatSummary;
    }

    static deleteChatSummary(){
        ContextSummary.set({title:"", object_type:"summary", memory:""} as SummaryContext);
        this.ChatSummary = {title:"", object_type:"summary", memory:""};
    }

    static updateChatMemory(memory:Memory){
        this.ChatMemory[memory.id] = memory;
        ContextMemory.set(this.ChatMemory);
        this.storage_service.store("memory", {memory:this.ChatMemory, expiration:this.storage_service.createExpiration(TimeFrame.Day, 1)});
    }

    static getChatMemory(){
        return this.ChatMemory;
    }

    static deleteChatMemory(){
        this.ChatMemory = {};
        ContextMemory.set(this.ChatMemory);
    }

    public static async LLMFactory(llm: LLMs): Promise<LLMAPIService> {
        switch (llm) {
            case LLMs.gpt4o || LLMs.gpt3turbo:
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