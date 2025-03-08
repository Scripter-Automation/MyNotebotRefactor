import type { Conversation, Context } from "../../../types";
import LLMAPIService from "../LLMAPIService";


export default class EndpointGemini extends LLMAPIService {
    protected endpoints: { [key: string]: string; } = {};
    protected chatHistory: Conversation[] = [];
    protected developerInstructions?: string | undefined;
    promptLLM(prompt: string, context: Context): Promise<{ success: boolean; message: string; response: string; }> {
        throw new Error("Method not implemented.");
    }
    streamLLM(prompt: string, context: Context): Promise<{ success: boolean; message: string; response: string; }> {
        throw new Error("Method not implemented.");
    }
    summerize(chat: Conversation[]): Promise<{ success: boolean; message: string; response: string; }> {
        throw new Error("Method not implemented.");
    }





}