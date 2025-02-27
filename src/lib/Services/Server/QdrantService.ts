import {QdrantClient} from '@qdrant/js-client-rest'
import { config } from 'dotenv';
import type {  Context, Note, Notebook, NotebookCreator, NotebookInstance, NoteCreator, NoteInstance, NoteMessage, Section, SectionBuilder, SectionCreator, SectionInstance } from '../../../app';
import OpenAIService from './OpenAIService';

enum Notebook_Object_Type {
    Notebook = "notebooks",
    Section = "sections",
    Note = "notes",
    Message = "messages"
}



export default class QdrantService{
    
    private user_id:string;
    private client?:QdrantClient;
    private llm:OpenAIService;

    constructor(user_id?:string){
        if(!user_id){
            throw new Error("User id is required")
        }
        this.init()
        this.user_id = user_id;
        this.llm = new OpenAIService();
    }

    private async init(){
        if (process.env.NODE_ENV !== 'production') { config(); }
        this.client = new QdrantClient({
            url: process.env.DATABASE_URL,
            apiKey: process.env.QDRANT_API_KEY,
        });

        try{
            const result = await this.client.getCollections();
        }catch(error){
            console.log(error);
        }
    }

    /**
     * Creates a client's collection in order to save his data
     * in his own cluster so that it wont get mixed with other user's data
     */
    public async createCustomerCollection(){
        if(this.check_client()){
            await this.client?.createCollection(this.user_id,{
                vectors:{
                    size:3072,
                    distance:"Cosine"
                }
            });
            
        }else{
            throw new Error("Client not initialized")
        }
    }
    /**
     * Creates a new embeding representing a notebook where it will have as metadata the title, topic and description
     * of the notebook in order to be able to retrive distant embedings
     * @param title The title for the notebook
     * @param topic The topic of the notebook
     * @param description The description of the notebook
     */
    public async create_notebook(id:string, title:string, topic:string, description:string){
        const notebook:NotebookCreator = {
            id:id,
            object_type:Notebook_Object_Type.Notebook,
            title:title,
            topic:topic,
            description:description
        }
        const vector = await this.llm.generate_embeding(JSON.stringify(notebook));

        if(this.check_client()){
            try{
                this.client?.upsert(this.user_id,{
                    points:[
                        {
                            id:notebook.id,
                            payload:notebook,
                            vector:vector
                        }
                    ]
                })

            }catch(error){
                console.error(error)
            }
            
        }else{
            throw new Error("Client not initialized")
        }
    }

    /**
     * Creates a new section in the database
     * @param id The id of the section
     * @param title The title of the section
     * @param description The description of the section
     */
    public async create_section(id:string, notebook_id:string, title:string, topic:string, description:string){
        const section:SectionCreator = {
            id:id,
            object_type:Notebook_Object_Type.Section,
            topic:topic,
            notebookId:notebook_id,
            title:title,
            description:description,
        }
        const vector = await this.llm.generate_embeding(JSON.stringify(section));
        
        if(this.check_client()){
            try{
                this.client?.upsert(this.user_id,{
                    points:[
                        {
                            id:section.id,
                            payload:section,
                            vector:vector
                        }
                    ]
                })

            }catch(error){
                console.error(error)
            }
            
        }else{
            throw new Error("Client not initialized")
        }
    }

    public async get_all_sections():Promise<Section[]>{ 
        if(this.check_client()){
            const result = await this.client?.scroll(this.user_id,{
               filter:{
                must:[
                    {
                        key:"object_type",
                        match:{
                            value:Notebook_Object_Type.Section
                        }
                    },
                ]
               },
            });

            return result?.points.map((point)=>{
                return point.payload as Section;
            }) ?? [];
        }else{
            throw new Error("Client not initialized")
        }
    }


    public async get_all_notes():Promise<Note[]>{
        const filter = {
            must:[
                {
                    key:"object_type",
                    match:{
                        value:Notebook_Object_Type.Note
                    }
                },

            ]
           }


        if(this.check_client()){
            try{
                const result = await this.client?.scroll(this.user_id,{
                    filter:filter
                    });
                return result?.points.map((point)=>{
                    return point.payload as Note;
                }) ?? [];

            }catch(error){
                console.error(error)
                return []
            }
        }else{
            throw new Error("Client not initialized")
        }
    }

    public async create_note(id:string, notebook_id:string, section_id:string, title:string){

        const note = {
            id:id,
            object_type:"notes",
            notebookId:notebook_id,
            sectionId:section_id,
            title:title,
        } as NoteCreator;
        const vector = await this.llm.generate_embeding(JSON.stringify(note));
        if(this.check_client()){
            try{
                this.client?.upsert(this.user_id,{
                    points:[
                        {
                            id:note.id,
                            payload:note,
                            vector:vector
                        }
                    ]
                })
                return note;

                
            }catch(error){
                throw error 
            }
            
        }else{
            throw new Error("Client not initialized")
        }

    }

    public async create_message(id:string, note_id:string, notebook_id:string, section_id:string, prompt:string, response:string){
        const message:NoteMessage = {
            id:id,
            object_type:Notebook_Object_Type.Message,
            note_id:note_id,
            notebookId:notebook_id,
            sectionId:section_id,
            prompt:prompt,
            response:response
        }
        const vector = await this.llm.generate_embeding(JSON.stringify(message));
        if(this.check_client()){
            try{
                this.client?.upsert(this.user_id,{
                    points:[
                        {
                            id:message.id,
                            payload:message,
                            vector:vector
                        }
                    ]
                })

            }catch(error){
                console.error(error)
            }
            
        }else{
            throw new Error("Client not initialized")
        }
    }

    /**
     * Checks if the client of the service is initialized before performing any operation
     * @returns {boolean} if the client has been instanciated or not
     */
    private check_client():boolean{
        return this.client!=undefined;
    }

    /**
     * Gets all the notebooks that the user has created
     * @returns {Notebook[]} An array of notebooks
     */
    public async get_all_notebooks():Promise<Notebook[]>{
        if(this.check_client()){

            const result = await this.client?.scroll(this.user_id,{
               filter:{
                must:[
                    {
                        key:"object_type",
                        match:{
                            value:Notebook_Object_Type.Notebook
                        }
                    }
                ]
               },
            });
            return result?.points.map((point)=>{
                return point.payload as Notebook;
            }) ?? [];
        }else{
            throw new Error("Client not initialized")
        }
    }
        

    public async get_context(context:Context, prompt:number[]){
       
       const filter = {
        must:[
            {
                key:"object_type"
            }
        ]
       }
        /*const filter = {
            must:[
                {
                    key:"object_type",
                    match:{
                        value:"messages"
                    }
                },
            ]
        }

        if(public_context.notebook != "General"){
            filter.must.push({
                key:"notebookId",
                match:{
                    value:context.notebook
                }
            })
        }

        if(public_context.section != "General"){
            filter.must.push({
                key:"sectionId",
                match:{
                    value:context.section
                }
            })
        }

        if (public_context.note != "General"){
            filter.must.push({
                key:"note_id",
                match:{
                    value:context.note
                }
            })
        }*/

        return await this.client?.query(this.user_id,{
            query:prompt,
            filter:filter,
            limit:5,
            with_payload:true
        })


    }


}