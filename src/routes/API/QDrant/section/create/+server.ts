import FirebsaeAdminService from "$lib/Services/firebaseAdminService";
import FirebaseService from "$lib/Services/firebaseService";
import QdrantService from "$lib/Services/qdrantService";
import type { RequestHandler } from "@sveltejs/kit";
import type { SectionInstance } from "../../../../../app";

export const POST: RequestHandler = async ({ request, cookies }) => {
    const firebase = await FirebsaeAdminService.getInstance();
    const data = (await request.json()) as SectionInstance;
    const rag = new QdrantService(firebase.get_uid(await firebase.getUser(cookies.get("email"))));
    
    try{
        rag.create_section(data.id, data.notebookId, data.title, data.topic ,data.description as string);
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