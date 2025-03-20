
import type { BaseMessage, Context, Message, Note,  Notebook, NotebookInstance, NoteInstance, Section, SectionInstance, SummarySchema } from "../../../types";
import { LLMs } from "../../../types";
import {v4 as uuidv4} from 'uuid';
import StorageService, { TimeFrame } from "./StorageService";
import EndpointChatGPT from "$lib/SDK/LLMs/EndpointChatGPT";
import LLMAPIService from "$lib/SDK/LLMAPIService";
import { error } from "@sveltejs/kit";


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
    private summary_update_function?:(summary:SummarySchema)=>void;
    private currentLLM!:LLMAPIService;
    private currentSummarizer!:LLMAPIService;
    




    constructor(currentLLM:LLMs){
        this.setLLM(currentLLM);
        this.setSummarrizer(LLMs.gemini);
    }

    public async setLLM(llm:LLMs): Promise<void> {
        this.currentLLM = await LLMAPIService.LLMFactory(llm);
    }

    public async setSummarrizer(llm:LLMs){
        this.currentSummarizer = await LLMAPIService.LLMFactory(llm);
    }
 
    public setUpdateFunction(func:(messages:BaseMessage[])=>void){
        this.update_function = func;
    }

    public setSummaryUpdateFunction(func:(summary:SummarySchema)=>void){
        this.summary_update_function = func;
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

        this.currentSummarizer.summarize(prompt, res.response)
        .then((summary)=>{
            console.log("ChatService summary", summary)
            if(summary.success){
                this.summary_update_function!(summary.response);
            }
        }).catch((error)=>{
            console.error(error)
        });
  

    }


}