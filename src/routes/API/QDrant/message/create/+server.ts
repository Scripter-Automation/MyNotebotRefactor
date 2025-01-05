import FirebsaeAdminService from "$lib/firebaseAdminService";
import QdrantService from "$lib/qdrantService";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const firebase = await FirebsaeAdminService.getInstance();
    const data = await request.json();
    const rag = new QdrantService(firebase.get_uid());

    try{
        rag.create_message(data.id, data.note_id, data.notebook_id, data.section_id, data.prompt, data.response);   
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



