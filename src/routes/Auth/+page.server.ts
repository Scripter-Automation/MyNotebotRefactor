import { type Actions, fail } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import FirebaseService from "$lib/firebaseService";
import QdrantService from "$lib/qdrantService";
import { v4 as uuid4 } from "uuid";

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
        let success:boolean = false;
        const email = formData.get("email");
        try{
            
            await firebase.register(email as string, formData.get("password") as string)
            const qdrant = new QdrantService(firebase.get_uid());
            await qdrant.createCustomerCollection();
            const notebook_id = uuid4();
            await qdrant.create_notebook(notebook_id,"General","General","This is the default notebook, where all your notes will be stored when no notebook context is defined");
            await qdrant.create_section(uuid4(),notebook_id,"General","Default section","This is the default section for the default notebook");
            success=true;
        }catch(error){

            return fail(400, {email, error:true ,message:"Something went wrong contact support"})
            
        }finally{
            if(success) throw redirect(303, "/Private/Chat")
        }
    }

};