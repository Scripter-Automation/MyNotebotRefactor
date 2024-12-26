import FirebaseService from "$lib/firebaseService";
import QdrantService from "$lib/qdrantService";
import type { RequestHandler } from "@sveltejs/kit";


export const POST:RequestHandler = async ({ request }) => {
    const data = await request.json();
    const firebase = new FirebaseService();
    const rag = new QdrantService(firebase.get_uid());
    let notes;
    try{
        notes = await rag.get_all_notes(data.notebook, data.section);
    }catch(error){
        console.error(error);
        return new Response(null,{
            status:400,
            headers:{
                'Content-Type':'text/plain'
            }
        });
    }
    return new Response(JSON.stringify(notes),{
        status: 200,
        headers:{
            'Content-Type':'text/plain'
        }
    });
};
