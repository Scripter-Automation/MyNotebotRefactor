import FirebsaeAdminService from "$lib/Services/firebaseAdminService";
import QdrantService from "$lib/Services/qdrantService";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
    const firebase = await FirebsaeAdminService.getInstance();
    const data = await request.json();
    const rag = new QdrantService(firebase.get_uid(await firebase.getUser(cookies.get("email"))));
    
    try{
        //rag.update_note(data.id, data.body);
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
}