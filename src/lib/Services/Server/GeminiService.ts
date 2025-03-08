
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";


export default class GeminiService {

    private app: GoogleGenerativeAI;


    constructor(){
        if (process.env.NODE_ENV !== 'production') { config(); }
        this.app = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY as string
        );
    }
}