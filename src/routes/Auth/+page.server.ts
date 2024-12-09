import { type Actions, fail } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import FirebaseService from "$lib/firebaseService";
import MongoService from "$lib/mongoService";

export const actions: Actions = {

    
    login:async ({request})=>{
        const formData = await request.formData()
        const firebase = new FirebaseService();
        let success:boolean= false;
        const email = formData.get("email");
        try{
            await firebase.login(email as string, formData.get("password") as string )
            success=true;
        }catch(err:any){
            if(err["code"]?.includes("invalid-credential")){
                return fail(400,{email, error:true, message:"Invalid username or password"})
            }else{
                return fail(400, {email, error:true ,message:"Something went wrong contact support"})
            }
        }finally{
           if(success) throw redirect(303, "/Private/Chat")
        }
        

    },
    register:async ({request})=>{
        const formData = await request.formData()
        const firebase = new FirebaseService();
        const mongo = new MongoService(firebase.get_uid());
        let success:boolean = false;
        const email = formData.get("email");
        try{
            await firebase.register(email as string, formData.get("password") as string)
            await mongo.create_client_cluster();
            success=true;
        }catch(error){

            return fail(400, {email, error:true ,message:"Something went wrong contact support"})
            
        }finally{
            if(success) throw redirect(303, "/Private/Chat")
        }
    }

};