import type { Conversation, Context, SummarySchema } from "../../../types";
import LLMAPIService from "../LLMAPIService";


export default class EndpointGemini extends LLMAPIService {
    endpoints: { [key: string]: string; } = {
        summarize: "/api/gemini/summarize"
    };

    
    promptLLM(prompt: string, context: Context): Promise<{ success: boolean; message: string; response: string; }> {
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

            return {success:true, message:"Chat summarized", response:JSON.parse(data[0].text) as SummarySchema}
        }catch(error){
            console.error(error);
            return {success:false, message:"Error summarizing chat", response:{summary:"", new_memory:false}}
        }
    }





}