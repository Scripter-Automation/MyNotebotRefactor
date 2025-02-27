
import { Conversation } from '../../../../app';
import LLMAPIService from '../LLMAPIService';

/** APIService doesn't seem to be the right inheritence for this class */
export default class ChatGPTService extends LLMAPIService {
    endpoints = {
        prompt: "/API/ChatGPT/prompt",
        stream: "/API/ChatGPT/stream"
    };
    chatHistory: Conversation[];
    developerInstructions?: string | undefined = `
        Eres una aplicación de RAG en la cual el usuario es capaz de usar información
        almacenada en forma de cuaderno, sección y nota. Basado en la información almacenada
        debes de generar una respuesta a la pregunta del usuario, si no se puede conseguir contexto
        para mejorar tu respuesta entonces responde como normalmente lo harias.
    `;

    private fetchedContext: string = "No se cuenta con contexto para mejorar la respuesta";

    promptLLM(prompt: string): Promise<{ success: boolean; message: string; response: string; }> {
        throw new Error('Method not implemented.');
    }
    streamLLM(prompt: string): Promise<{ success: boolean; message: string; response: string; }> {
        throw new Error('Method not implemented.');
    }

    public setContext(context: string): void {
        this.fetchedContext = context;
    }

}