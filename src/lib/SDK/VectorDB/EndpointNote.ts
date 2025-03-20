import type { Item } from "../../Services/Client/StorageService";
import APIService from "../APIService";
import { ContentType, type NoteBuilder, type NoteInstance } from "../../../types";

export default class EndpointNote extends APIService{
    endpoint: string = "/api/qdrant/note";

    constructor(){
        super();
    }

    get(params?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    update(params?: any): Promise<{ success: boolean; message: string; object?: any; }> {
        throw new Error("Method not implemented.");
    }
    delete(params?: any): Promise<{ success: boolean; message: string; }> {
        throw new Error("Method not implemented.");
    }
    async create(params: NoteBuilder): Promise<{ success: boolean; message: string; object?: NoteInstance;}> {
        try{
            params = {...params, id:this.generate_UID() ,object_type:ContentType.notes}
            fetch(this.endpoint+"/create",
                {
                    method:"POST",
                    body:JSON.stringify(params)
                }
            )
            const update = this.updateStorage(params as NoteInstance);
            if(!update.success) return update;
            
    
            return {success:true, message:"Nota creada exitosamente", object:params as NoteInstance}
        }catch(error){
            console.error(error);
            return {success:false, message:"Error al crear la nota, si el error"};
        }
    }
    updateStorage(params: NoteInstance): { success: boolean; message: string; } {
        let current_notes = this.storageService.get("notes") as Item;
        if(!current_notes) return {success:false, message:"No se encontraron notas, si este error persiste contactar a soporte"};
        current_notes.notes[params.sectionId as string] = params
        this.storageService.store("notes", current_notes)
        return {success:true, message:"Nota actualizada exitosamente"}
    }

}