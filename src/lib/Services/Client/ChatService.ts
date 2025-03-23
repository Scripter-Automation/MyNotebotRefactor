
import type { BaseMessage, Context, Memory, MemorySchema, Message, Note,  Notebook, NotebookInstance, NoteInstance, Section, SectionInstance, SummarySchema } from "../../../types";
import { LLMs } from "../../../types";
import {v4 as uuidv4} from 'uuid';
import StorageService, { TimeFrame } from "./StorageService";
import EndpointChatGPT from "$lib/SDK/LLMs/EndpointChatGPT";
import LLMAPIService from "$lib/SDK/LLMAPIService";
import { error } from "@sveltejs/kit";
import { ContextNote } from "../../../store";


export enum ChatState{
    Entire_context=0,
    Notebook_context=1,
    Section_context=2,
    Note_context=3,
    User_answer=4
}



export default class Chat{

    public notebooks:NotebookInstance[]=[];
    public sections:{[key: string]: SectionInstance[]} = {};
    public notes:{[key:string]:NoteInstance[]} = {};
    public recorded_messages:{[key:string]:BaseMessage[]} = {};
    private action?:(...params:any[])=>void;
    private update_function?:(messages:BaseMessage[])=>void;
    private currentLLM!:LLMAPIService;
    private currentSummarizer!:LLMAPIService;
    private currentNoteTaker!:LLMAPIService;
    
    




    constructor(currentLLM:LLMs){
        this.setLLM(currentLLM);
        this.setSummarrizer(LLMs.gemini);
        this.setNoteTaker(LLMs.gpt4o);
    }

    public async setLLM(llm:LLMs): Promise<void> {
        this.currentLLM = await LLMAPIService.LLMFactory(llm);
    }

    public async setSummarrizer(llm:LLMs){
        this.currentSummarizer = await LLMAPIService.LLMFactory(llm);
    }

    public async setNoteTaker(llm:LLMs){
        this.currentNoteTaker = await LLMAPIService.LLMFactory(llm);
    }
 
    public setUpdateFunction(func:(messages:BaseMessage[])=>void){
        this.update_function = func;
    }


    private cosineSimilarity(
        singleVector: number[], 
        listOfVectors: MemorySchema
    ): { topVector: Memory; topScore: number } {
        console.log("evaluating memories", listOfVectors)
        console.log("corresponsing length", Object.keys(listOfVectors).length)
        if (Object.keys(listOfVectors).length == 0) {
            return {topVector: {id:"",text:"",embeding:[],saved:false}, topScore: 0}
        }
    
        let topScore: number = -Infinity;
        let topVector: Memory | null = null;
    
        for (const vector of Object.values(listOfVectors)) {
            if (singleVector.length !== vector.embeding.length) {
                throw new Error("Vectors must be of the same length.");
            }
    
            const dotProduct: number = singleVector.reduce((sum, val, i) => sum + val * vector.embeding[i], 0);
            const magnitudeA: number = Math.sqrt(singleVector.reduce((sum, val) => sum + val * val, 0));
            const magnitudeB: number = Math.sqrt(vector.embeding.reduce((sum, val) => sum + val * val, 0));
    
            const similarity: number = magnitudeA === 0 || magnitudeB === 0 ? 0 : dotProduct / (magnitudeA * magnitudeB);
    
            if (similarity > topScore) {
                topScore = similarity;
                topVector = vector;
            }
        }
    
        if (!topVector) {
            throw new Error("No valid vector found.");
        }
    
        return { topVector, topScore };
    }
    

    private async chat(prompt:string, context:Context){
       return await this.currentLLM.promptLLM(prompt,context)
    }

    private set_action(action:(...params:any[])=>void){
        this.action = action;
    }


    public async respond(prompt:string, context:Context){
        console.log(context)
        console.log("user text", prompt)
        this.update_function!([{
            type:"normal",
            content:prompt,
            user_generated:true
        } as BaseMessage]);
 

        const res = await this.chat(prompt as string, context);
        // res contains a embeding property containing the users prompt as an embeding
        console.log(res);
        this.update_function!([{
            type:"normal",
            content:res.response,
            user_generated:false
        } as BaseMessage])

        // Code ran beyond this point, should not appear within the chat itself,
        // this part is used for asyncronous actions that are not time sensitive for
        // the user to see. Meaning that the developer should no longer use await 
        // after this point.

        this.currentSummarizer.summarize(prompt, res.response).then((summary)=>{
            if(summary.success){
                LLMAPIService.updateChatSummary(summary.response.summary);
            }
        }).catch((error)=>{
            console.error(error)
        });

        //The similarity search should be performed before this memorization process and the memorize
        // method should run after the similarity search.

        (async ()=>{
            try{
                const top_memory =  this.cosineSimilarity(res.embeding,LLMAPIService.getChatMemory());
                let produced_memory:Memory;
                this.currentSummarizer.memorize(prompt, res.response, top_memory)
                .then(async (memory)=>{
                    if(memory.success){
                        console.log(memory)
                        produced_memory = memory.response;
                        LLMAPIService.updateChatMemory(memory.response);
                        console.log("cleaned memories",LLMAPIService.getChatMemory());

                        let note:{success: boolean; message: string; response: any;};
                        if(top_memory.topScore > 0.5){
                            note = await this.currentNoteTaker.annotate(produced_memory,"");
                        }else{
                             note = await this.currentNoteTaker.annotate(produced_memory,"");
                        }
                        console.log(note)
                        if(note.success){
                            ContextNote.set(note.response)
                        }else{
                            console.error("Note creation failed")
                        }
                    }
                }).catch((error)=>{
                    console.error(error)
                });


            }catch(error){
                console.error(error);
            }
        })()


  


    }


}