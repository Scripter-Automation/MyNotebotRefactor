import StorageService from "../Services/Client/StorageService";
import {v4 as uuidv4} from 'uuid';
/**
 * A class meant to get the distinct API endpoints and make them accessable in the
 * client. Not meant to be used in the server. It splits the different API endpoints
 * into an easy to use 
 */
export default abstract class APIService{
    abstract endpoint:string;
    protected storageService:StorageService;

    constructor(){
      this.storageService = new StorageService();
      
    }
    public generate_UID():string{
      return uuidv4();
    }
    abstract get(params?:any):Promise<any>;
    abstract getAll():Promise<any[]>;
    abstract update(params?:any):Promise<{success:boolean,message:string, object?:any}>;
    abstract delete(params?:any):Promise<{success:boolean,message:string}>;
    abstract create(params?:any):Promise<{success:boolean,message:string, object?:any}>;
    abstract updateStorage(params?:any):{success:boolean,message:string};

    
}