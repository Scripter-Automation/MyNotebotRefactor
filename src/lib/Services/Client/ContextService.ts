import type { NotebookInstance } from "../../../types";
import StorageService, { TimeFrame } from "./StorageService";


export default class ContextService{

    fetch: typeof fetch;
    private content: NotebookInstance[] = [];
    private storage_service = new StorageService();
    constructor(custom_fetch: typeof fetch){
        this.fetch = custom_fetch;
    }

    public async get_context(){
        const stored_context = this.storage_service.get("context");
        if(stored_context == null || stored_context == undefined ){
            const response = await this.fetch("/api/context/initialize",{
                method:"GET"
            });
            const res = await response.json();
   
            if(response.status !== 200){
                throw new Error("Error al obtener el contexto");
            }else{
                this.content = res
                this.storage_service.store("context",{context:res, expiration:this.storage_service.createExpiration(TimeFrame.Day,1)});
            }
        }else{
            this.content = this.storage_service.get("context")!.context as NotebookInstance[];
        }
    }

    public get_content(){
        return this.content;
    }

    

}