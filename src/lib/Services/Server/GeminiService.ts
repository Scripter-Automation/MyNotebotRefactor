
import { GoogleGenerativeAI, type GenerateContentRequest, type Schema } from "@google/generative-ai";
import { config } from "dotenv";


export default class GeminiService {

    private app: GoogleGenerativeAI;
    private model ;

    constructor(system_instructions?:string, schema?:Schema){
        if (process.env.NODE_ENV !== 'production') { config(); }
        this.app = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY as string
        );
        this.model = this.app.getGenerativeModel({
            "model": "gemini-2.0-flash",
            systemInstruction: system_instructions,
            generationConfig:{
                responseMimeType: (schema !== undefined) ? "application/json" : "text/plain",
                responseSchema: schema
            }
        });

    }


    public async prompt(prompt:GenerateContentRequest){
        const result = await this.model.generateContent(prompt);
        return result.response
    }
}