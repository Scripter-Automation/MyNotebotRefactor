import type APIService from "./APIService";

export default class NotebookEndpoint implements APIService {
    endpoint: string = "/API/QDrant/notebook";
    get(params?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    update(params?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    delete(params?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async create(params: { id: string, title: string, topic: string, description?: string, tags?: string }): Promise<{success:boolean,message:string}> {
        try{
            await fetch(this.endpoint + "/create", {
                method: "POST",
                body: JSON.stringify(params)
            });
            return {success:true, message:"Cuaderno creado exitosamente"}
        }catch(error){
            console.error(error);
            return {success:false, message:"Error al crear el cuaderno, si el error continua favor de contactar a soporte"}
        }
        
    }

}