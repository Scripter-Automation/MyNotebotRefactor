import type { ContentType, Section, SectionBuilder, SectionInstance } from "../../../app";
import type { Item } from "../../Services/Client/StorageService";
import APIService from "../APIService";


export default class EndpointSection extends APIService {
    endpoint: string = "/api/qdrant/section";

    constructor(){
        super();        
    };

    get(params?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    update(params?: any): Promise<{ success: boolean; message: string; }> {
        throw new Error("Method not implemented.");
    }
    delete(params?: any): Promise<{ success: boolean; message: string; }> {
        throw new Error("Method not implemented.");
    }
    async create(params:SectionBuilder): Promise<{ success: boolean; message: string; object?: SectionInstance}> {
        try{
            params = {...params, id:this.generate_UID() ,object_type:"sections" as ContentType, children:[]}
            await fetch(this.endpoint + "/create", {
                method: "POST",
                body: JSON.stringify(params)
            });
            const update = this.updateStorage(params as SectionInstance);
            if(!update.success) return update;

            return {success:true, message:"Seccion creada exitosamente", object:params as SectionInstance }
        }catch(error){
            console.error(error);
            return {success:false, message:"Error al crear la seccion, si el error"};
        }
   
    }
    updateStorage(params?:SectionInstance): {success:boolean,message:string} {
        const current_sections = this.storageService.get("sections") as Item;
        if(!current_sections) return {success:false, message:"No se encontraron secciones, si este error persiste contactar a soporte"};
        current_sections.sections[params?.notebookId as string] = params
        return {success:true, message:"Seccion actualizada exitosamente"}
    }

}