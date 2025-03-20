import CookiesAPIService from "../CookiesAPIService";


export default class EndpointUserCookies extends CookiesAPIService{
    endpoint: string = "/public-api/user-cookies";
    public async get(params?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    public async update(params?: any): Promise<{ success: boolean; message: string; object?: any; }> {
        throw new Error("Method not implemented.");
    }
    public async delete(): Promise<{ success: boolean; message: string; }> {
        try{
            await fetch(this.endpoint + "/delete", {
                method: "DELETE",
            });
            return {success:true, message:"Cookie eliminada exitosamente"}
        }catch(error){
            console.error(error);
            return {success:false, message:"Error al eliminar la cookie"};
        }
    }
    public async create(params: {email:string, token:string, register:boolean}): Promise<{ success: boolean; message: string; object?: any; }> {
        try{
            //console.log(params);
            await fetch(this.endpoint + "/create", {
                method: "POST",
                body: JSON.stringify(params)
            });
            return {success:true, message:"Cookie creada exitosamente"}
        }catch(error){
            console.error(error);
            return {success:false, message:"Error al crear la cookie"};
        }
    }


}