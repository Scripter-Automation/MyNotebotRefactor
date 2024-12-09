import { type Actions, fail } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import FirebaseService from "$lib/firebaseService";
import MongoService from "$lib/mongoService";
import RagService from "$lib/RAGService";

export const actions: Actions = {

    
    new_notebook:async ({request})=>{
        const firebase = new FirebaseService();
        const formData = await request.formData()
        const rag = new RagService(firebase.get_uid())
        rag.create_notebook(formData.get("title") as string, formData.get("topic") as string, formData.get("description") as string )
        return {success:true};
    },
    ask_question:async ({request})=>{
        const firebase = new FirebaseService();
        const formData = await request.formData()
        const rag = new RagService(firebase.get_uid())
    }
};
