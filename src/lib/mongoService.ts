import { Db, MongoClient } from "mongodb";
import type { Notebook } from "../app";
import FirebaseService from "./firebaseService";
import { config } from "dotenv";
// Replace the uri string with your connection string.

export default class MongoService{
    
    private uri:string;
    private client:MongoClient;
    private database:Db;
    private user_id:string;


    constructor(user_id:string){
        config();
        this.user_id = user_id;
        this.uri = process.env.MONGO_DB_CONNECTION_STRING as string;
        this.client = new MongoClient(this.uri);
        this.database =  this.client.db('admin');
    }

    async get_client_cluster(user_id:string) {
        try {
          const cluster = this.database.collection(user_id);
          return cluster;
        } catch (e) {
          console.error(e);
        }
      }

    public async create_client_cluster(){
        try{
            const cluster = this.database.collection(this.user_id);
            const doc:Notebook = {
                id: FirebaseService.CreateUID(10),
                title:"First Notebook",
                topic:"Default"
            };
            await cluster.insertOne(doc);
            
        }catch(error){
            console.error(error);
        }
    }  
    public async create_notebook(user_id:string,title:string,topic:string){
        try{
            const cluster = this.database.collection(user_id);
            const doc:Notebook = {
                id: FirebaseService.CreateUID(10),
                title:title,
                topic:topic
            };
            await cluster.insertOne(doc);
            
        }catch(error){
            console.error(error);
        }
    }

    public async get_notebooks(user_id:string){
        try{
            const cluster = this.database.collection(user_id);
            const notebooks = await cluster.find().toArray();
            return notebooks;
        }catch(error){
            console.error(error);
        }
    }

    
}