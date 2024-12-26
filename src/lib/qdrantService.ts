import {QdrantClient} from '@qdrant/js-client-rest'
import { config } from 'dotenv';
import type { Notebook } from '../app';
import FirebaseService from './firebaseService';
import OpenAIService from './OpenAIService';

export default class QdrantService{
    
    private user_id:string;
    private client?:QdrantClient;

    constructor(user_id:string){
        this.init()
        this.user_id = user_id;
    }

    private async init(){
        config();
        this.client = new QdrantClient({
            url: process.env.DATABASE_URL,
            apiKey: process.env.QDRANT_API_KEY,
        });

        try{
            const result = await this.client.getCollections();
            console.log(result);
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
            console.log(this.client?.createCollection(this.user_id,{
                vectors:{
                    size:1536,
                    distance:"Cosine"
                }
            }));
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
    public async create_notebook(title:string, topic:string, description:string){
        
        const notebook:Notebook = {
            id:FirebaseService.CreateUID(10),
            object_type:"notebook",
            title:title,
            topic:topic,
            description:description
        }

        const openai = new OpenAIService();
        const vector = await openai.generate_embeding(JSON.stringify(notebook));
        

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
     * Checks if the client of the service is initialized before performing any operation
     * @returns {boolean} if the client has been instanciated or not
     */
    private check_client():boolean{
        return this.client!=undefined;
    }
        


}