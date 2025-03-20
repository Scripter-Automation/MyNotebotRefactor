
import type { Context, Conversation, SummarySchema } from '../../../types';
import LLMAPIService from '../LLMAPIService';

/** APIService doesn't seem to be the right inheritence for this class */
export default class EndpointChatGPT extends LLMAPIService {

    endpoints = {
        prompt: "/api/chatgpt/prompt",
        stream: "/api/chatgpt/stream"
    };


    public async promptLLM(prompt: string, context:Context): Promise<{ success: boolean; message: string; response: string; }> {
        try{
            const res = await fetch(this.endpoints.prompt, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt,
                    context
                })
            });
            const data = await res.json();
            console.log("data on sdk",data)
            return {
                success: true,
                message: "Petición realizada con éxito",
                response: data
            }
        }catch(error){
            return {
                success: false,
                message: "Error al realizar la petición",
                response: ""
            }
        }
    }
    streamLLM(prompt: string): Promise<{ success: boolean; message: string; response: string; }> {
        throw new Error('Method not implemented.');
    }

    summarize(prompt:string, response:string): Promise<{ success: boolean; message: string; response: SummarySchema; }> {
        throw new Error('Method not implemented.');
    }


}