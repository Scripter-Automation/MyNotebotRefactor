
import type { Context, Conversation } from '../../../types';
import LLMAPIService from '../LLMAPIService';

/** APIService doesn't seem to be the right inheritence for this class */
export default class EndpointChatGPT extends LLMAPIService {
    summerize(chat: Conversation[]): Promise<{ success: boolean; message: string; response: string; }> {
        throw new Error('Method not implemented.');
    }
    endpoints = {
        prompt: "/api/chatgpt/prompt",
        stream: "/api/chatgpt/stream"
    };
    chatHistory: Conversation[] = [];
    developerInstructions?: string | undefined = `
        Eres una aplicación de RAG en la cual el usuario es capaz de usar información
        almacenada en forma de cuaderno, sección y nota. Basado en la información almacenada
        debes de generar una respuesta a la pregunta del usuario, si no se puede conseguir contexto
        para mejorar tu respuesta entonces responde como normalmente lo harias.
    `;
    /**
     * Depricated
    private fetchedContext: string = "No se cuenta con contexto para mejorar la respuesta";
     */

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

    /**
     * Depricated
     * 
    public setContext(context: string): void {
        this.fetchedContext = context;
    }
     */

}