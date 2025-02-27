import FirebsaeAdminService from "$lib/Services/Server/FirebaseAdminService";
import QdrantService from "$lib/Services/Server/QdrantService";
import type { RequestHandler } from "@sveltejs/kit";
import type { NoteInstance } from "../../../../../app";

export const POST: RequestHandler = async ({ request,cookies }) => {
    const firebase = await FirebsaeAdminService.getInstance();
    const data = (await request.json()) as NoteInstance;
    const rag = new QdrantService(firebase.get_uid(await firebase.getUser(cookies.get("email"))));
    
    try{
        rag.create_note(data.id, data.notebookId, data.sectionId, data.title);
    }catch(error){
        console.error(error);
        return new Response(null,{
            status:400,
            headers:{
                'Content-Type':'text/plain'
            }
        });
    }

    return new Response(null, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};