
import type { BaseMessage, Context, LLMs, Message, Note,  Notebook, NotebookInstance, NoteInstance, Section, SectionInstance } from "../../../types";
import {v4 as uuidv4} from 'uuid';
import StorageService, { TimeFrame } from "./StorageService";
import EndpointChatGPT from "$lib/SDK/LLMs/EndpointChatGPT";
import LLMAPIService from "$lib/SDK/LLMAPIService";


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
    private currentLLM:LLMAPIService;
    




    constructor(currentLLM:LLMs){
        this.currentLLM = LLMAPIService.LLMFactory(currentLLM);
    }


 
    public setUpdateFunction(func:(messages:BaseMessage[])=>void){
        this.update_function = func;
    }

    

    /*
    private chat_create_notebook(){
        
        const messages=[{
            type:"normal",
            user_generated:false,
            text:"¿Cual es el nombre de tu cuaderno?, ¿Cual es el tema?, ¿Cual es la descripcion?"
        } as Message];


        this.set_state(ChatState.User_answer);
        this.set_action(this.create_notebook);
        this.update_function(messages);
    }*/
   
    /*
    Depricated but useful for example of chat functions
    private chat_select_notebook(){
            
        const options = this.notebooks.map((notebook:any)=>{
            return {text:notebook.title, func:()=>{
                this.context = {
                    notebook:notebook.id
                }
                this.public_context = {
                    ...this.public_context,
                    notebook: notebook.title
                };
                this.update_context(this.public_context);
                this.set_state(ChatState.Notebook_context);
                this.update_function([{
                    type:"menu",
                    text:"Cuaderno seleccionado, ahora puedes empezar a agregar secciones a este cuaderno",
                    options:[
                        {text:"Nueva seccion", func:this.chat_create_section.bind(this)},
         
                        {text:"Nueva nota", func: this.chat_create_note.bind(this)},
      
                    ]
                } as Message])
            }}
        })
        this.update_function([{
            type:"menu",
            text:"Selecciona un cuaderno de la lista",
            options:options
        } as Message])
    }
        */

    /*private async create_notebook(title:string,topic:string,description:string){
        const notebook_id = uuidv4();
        await this.fetch("/API/QDrant/notebook/create",{
            method:"POST",
            body:JSON.stringify({
                id: notebook_id,
                title:title,
                topic:topic,
                description:description
            })
        })
        this.set_state(ChatState.Notebook_context);

        this.update_context(this.public_context);
        this.create_section("General","General","This is the general section of the notebook",true);
        this.update_function([{
            type:"menu",
            text:"Cuaderno creado con exito, ahora puedes empezar a agregar secciones a este cuaderno",
            options:[
                {text:"Nueva seccion", func:this.chat_create_section.bind(this)},
                {text:"Nueva nota", func:this.chat_create_note.bind(this)}
            ]
        } as Message]);
    }*/

    /*private chat_create_section(){

        const messages=[{
            type:"normal",
            user_generated:false,
            text:"¿Cual es el nombre de la seccion?, ¿Cual es el tema?, ¿Cual es la descripcion? Usa una coma para separar las respuestas a estas preguntas"
        } as Message];

        this.set_state(ChatState.User_answer);
        this.set_action(this.create_section);
        this.update_function(messages);

    }*/

    

    /*private async create_section(title:string,topic:string, description:string, default_section:boolean=false){
        const section_id = uuidv4();
        await this.fetch("/API/QDrant/section/create",{
            method:"POST",
            body:JSON.stringify({
                id:section_id,
                topic:topic,
                notebook_id:this.context?.notebook,
                title:title,
                description:description,
                notebook:this.context?.notebook
            })
        })
        if(default_section){


            this.update_context(this.public_context);
            return;
        }else{
            this.set_state(ChatState.Section_context);
            this.update_function([{
                type:"menu",
                text:"Seccion creada con exito, ahora puedes empezar a agregar notas a esta seccion",
                options:[
                    {text:"Nueva nota", func:this.chat_create_note.bind(this)},
                ]
            } as Message]);
        }
    }*/

    /*private chat_create_note(){
        

        const messages=[{
            type:"normal",
            user_generated:false,
            text:"¿Cual seria el nombre de esta nota? No uses comas por favor."
        } as Message];

        this.update_function(messages);
        this.set_state(ChatState.User_answer);
        this.set_action(this.create_note);
    }
    */


    

    /*private async create_note(title:string){
        const note_id = uuidv4();
        await this.fetch("/API/QDrant/note/create",{
            method:"POST",
            body:JSON.stringify({
                id:note_id,
                title:title,
            })
        })

        this.set_action(this.add_message_to_note.bind(this));

        this.set_state(ChatState.Note_context);
        this.context = {
            ...this.context,
            note:note_id
        }
        this.update_function([{
            type:"normal",
            text:"Nota creada con exito, todo lo que hablemos ahora sera almacenado en esta nota"
        } as Message]);
    }*/

    

    private async chat(prompt:string, context:Context){
       return await this.currentLLM.promptLLM(prompt,context)
    }

    private set_action(action:(...params:any[])=>void){
        this.action = action;
    }


    public async respond(params:string, context:Context){
        console.log(context)
        console.log("user text", params)
        this.update_function!([{
            type:"normal",
            content:params,
            user_generated:true
        } as BaseMessage]);
 

        const res = await this.chat(params as string, context);
        console.log(res);
        this.update_function!([{
            type:"normal",
            content:res.response,
            user_generated:false
        } as BaseMessage])
  

    }


}