import type { Conversation, Context, SummarySchema, MemorySchema, Memory } from "../../../types";
import type { NoteContext } from "../../../zodTypes";
import APIService from "../APIService";
import LLMAPIService from "../LLMAPIService";


export default class EndpointGemini extends LLMAPIService {

    constructor(){
        super();
    }

    endpoints: { [key: string]: string; } = {
        summarize: "/api/gemini/summarize",
        memorize: "/api/gemini/memorize"
    };

    
    promptLLM(prompt: string, context: Context): Promise<{ success: boolean; message: string; response: string; embeding:number[] }> {
        throw new Error("Method not implemented.");
    }
    streamLLM(prompt: string, context: Context): Promise<{ success: boolean; message: string; response: string; }> {
        throw new Error("Method not implemented.");
    }
    async summarize(prompt:string, response:string): Promise<{ success: boolean; message: string; response: SummarySchema; }> {
        
        try{
            const res = await fetch(this.endpoints.summarize, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt,
                    response,
                    summary:LLMAPIService.getChatSummary()

                })
            })

            const data = await res.json();
            console.log(data[0].text);
            console.log(JSON.parse(data[0].text));
            const parsed_response = JSON.parse(data[0].text);

            return {success:true, message:"Chat summarized", response: parsed_response as SummarySchema}
        }catch(error){
            console.error(error);
            return {success:false, message:"Error summarizing chat", response:{summary:""}}
        }
    }

    public async memorize(prompt: string, response: string, memory:{topVector:Memory, topScore:number}): Promise<{ success: boolean; message: string; response: Memory; }> {
         
        try{
            console.log("memorizing")
            console.log("top memory", memory)
            const res = await fetch(this.endpoints.memorize, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt,
                    response,
                    memories: memory.topScore > 0.1 ? memory.topVector : "No aplicable memory, ignore this section",
                    forceUpdate: memory.topScore > 0.5
                })
            })

            const data = await res.json();
            console.log("result from memorization", data);


            return {success:true, message:"Memories processed", response: data as Memory}
        }catch(error){
            console.error(error);
            return {success:false, message:"Error processing memories", response:{id:"", saved:false, text:"", embeding:[]}}
        }
    }



    annotate(memory: Memory, currentNote: any): Promise<{ success: boolean; message: string; response: NoteContext; }> {
        throw new Error("Method not implemented.");
    }

}