import FirebsaeAdminService from "$lib/Services/Server/FirebaseAdminService";
import QdrantService from "$lib/Services/Server/QdrantService";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request, cookies }) => {
  
        const firebase = await FirebsaeAdminService.getInstance();
        const rag = new QdrantService(firebase.get_uid(await firebase.getUser(cookies.get("email"))));
        const notebooks = await rag.get_all_notebooks();
        return new Response(JSON.stringify(notebooks), {
            status: 200,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    
};