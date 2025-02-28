import type { ContentType, NotebookBuilder, NotebookInstance } from "../../../app";
import type { Item } from "../../Services/Client/StorageService";
import APIService from "../APIService";

export default class EndpointNotebook extends APIService {
    endpoint: string = "/api/qdrant/notebook";

    constructor(){
        super();        
    }

    async create(params: NotebookBuilder): Promise<{success:boolean,message:string, object?:NotebookInstance}> {
        try{
            params = {...params, id:this.generate_UID() ,object_type:"notebooks" as ContentType, children:[]}
            await fetch(this.endpoint + "/create", {
                method: "POST",
                body: JSON.stringify(params)
            });
            const update = this.updateStorage(params as NotebookInstance);
            if(!update.success) return update;

            return {success:true, message:"Cuaderno creado exitosamente", object:params as NotebookInstance}
        }catch(error){
            console.error(error);
            return {success:false, message:"Error al crear el cuaderno, si el error continua favor de contactar a soporte"}
        }
        
    }

    updateStorage(params:NotebookInstance): {success:boolean,message:string} {
        const current_notebooks = this.storageService.get("notebooks") as Item;
        if(!current_notebooks) return {success:false, message:"No se encontraron cuadernos, si este error persiste contactar a soporte"};
        current_notebooks.notebooks.push(params)
        this.storageService.store("notebooks", current_notebooks)
        return {success:true, message:"Cuaderno actualizado exitosamente"}
    }

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


}