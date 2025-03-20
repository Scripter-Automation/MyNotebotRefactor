
export default abstract class CookiesAPIService{
    protected abstract endpoint:string;


    abstract get(params?:any):Promise<any>;
    abstract update(params?:any):Promise<{success:boolean,message:string, object?:any}>;
    abstract delete(params?:any):Promise<{success:boolean,message:string}>;
    abstract create(params?:any):Promise<{success:boolean,message:string, object?:any}>;
    
}