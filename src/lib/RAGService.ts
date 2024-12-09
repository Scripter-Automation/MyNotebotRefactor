import { JsonLoader, RAGApplication, RAGApplicationBuilder } from '@llm-tools/embedjs';
import { OllamaEmbeddings, Ollama } from '@llm-tools/embedjs-ollama';
import { WebLoader } from '@llm-tools/embedjs-loader-web';
import { MongoDb } from '@llm-tools/embedjs-mongodb';
import MongoService from './mongoService';
import FirebaseService from './firebaseService';
import { config } from 'dotenv';


export default class RagService{
    app:RAGApplication|null=null;
    user_id:string; 
    constructor(user:string){
        this.app = null;
        this.user_id=user;
        this.init();
    }
    
    private async init(){
        console.log(1)
        config();
        console.log(2)
        this.app = await new RAGApplicationBuilder()
        .setModel(new Ollama({ modelName: "llama3.2", baseUrl: 'http://localhost:11434' }))
        .setEmbeddingModel(new OllamaEmbeddings({ model: 'nomic-embed-text', baseUrl: 'http://localhost:11434' }))
        .setVectorDatabase(new MongoDb({
            collectionName:this.user_id,
            connectionString:process.env.MONGO_DB_CONNECTION_STRING as string
        }))
        .build();
        console.log(3)
        
        console.log(await this.app.query('What is the net worth of Elon Musk today?'));
        //Answer: The net worth of Elon Musk today is $258.7 billion.
    }

    public async ask(text:string){
        const response = await this.app?.query(text)
        console.log(response)
        return response;
    }

    private async generate_embeding(object:Object){
        this.app?.addLoader(new JsonLoader ({object:{...object, userId:this.user_id}}));
    }

    private async get_user_embedings(query:string){
        this.app?.search(query)
    }

    public async create_notebook(notebook_title:string, notebook_topic:string, notebook_description:string){
        this.generate_embeding({
            object_type:"notebook",
            notebook:notebook_title,
            topic:notebook_topic,
            description:notebook_description
        });
    }

}



