import { type Actions, fail } from "@sveltejs/kit";
import FirebaseService from "$lib/firebaseService";
import QdrantService from "$lib/qdrantService";

export const actions: Actions = {

    
    new_notebook:async ({request})=>{
        const firebase = new FirebaseService();
        const formData = await request.formData()
        const rag = new QdrantService(firebase.get_uid());
        rag.create_notebook(formData.get("title") as string, formData.get("topic") as string, formData.get("description") as string )
        return {success:true};
    },
    ask_question:async ({request})=>{
        const firebase = new FirebaseService();
        const formData = await request.formData()

    }
};
