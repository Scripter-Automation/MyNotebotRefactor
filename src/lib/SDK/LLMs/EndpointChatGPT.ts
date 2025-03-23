
import type { Context, Conversation, Memory, MemorySchema, SummarySchema } from '../../../types';
import type { NoteContext } from '../../../zodTypes';
import LLMAPIService from '../LLMAPIService';

/** APIService doesn't seem to be the right inheritence for this class */
export default class EndpointChatGPT extends LLMAPIService {

    constructor(){
        super();
    }

    endpoints = {
        prompt: "/api/chatgpt/prompt",
        stream: "/api/chatgpt/stream",
        annotate: "/api/chatgpt/annotate",
        summarize: "/api/chatgpt/summarize"
    };


    public async promptLLM(prompt: string, context:Context): Promise<{ success: boolean; message: string; response: string; embeding:number[]}> {
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
                response: data.res,
                embeding: data.embeding
            }
        }catch(error){
            return {
                success: false,
                message: "Error al realizar la petición",
                response: "",
                embeding: []
            }
        }
    }
    streamLLM(prompt: string): Promise<{ success: boolean; message: string; response: string; }> {
        throw new Error('Method not implemented.');
    }

    summarize(prompt:string, response:string): Promise<{ success: boolean; message: string; response: SummarySchema; }> {
        throw new Error('Method not implemented.');
    }

    memorize(prompt: string, response: string): Promise<{ success: boolean; message: string; response: Memory; }> {
        throw new Error('Method not implemented.');
    }


    public async annotate(memory: Memory, currentNote: any): Promise<{ success: boolean; message: string; response: NoteContext; }> {
        const res = await fetch(this.endpoints.annotate,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                memory:memory.text,
                currentNote
            })
        });

        const data = await res.json();
        console.log("Generated note",data)

        return {success:true, message:"Annotations performes correctly", response: data.res}
    }


}