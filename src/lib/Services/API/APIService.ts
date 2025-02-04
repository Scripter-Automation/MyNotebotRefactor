/**
 * A class meant to get the distinct API endpoints and make them accessable in the
 * client. Not meant to be used in the server. It splits the different API endpoints
 * into an easy to use 
 */
export default abstract class APIService{
    abstract endpoint:string;

    abstract get(params?:any):Promise<any>;
    abstract getAll():Promise<any[]>;
    abstract update(params?:any):Promise<{success:boolean,message:string}>;
    abstract delete(params?:any):Promise<{success:boolean,message:string}>;
    abstract create(params?:any):Promise<{success:boolean,message:string}>;

    
}