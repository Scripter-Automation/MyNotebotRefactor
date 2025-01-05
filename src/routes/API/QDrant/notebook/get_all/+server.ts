import FirebsaeAdminService from "$lib/firebaseAdminService";
import QdrantService from "$lib/qdrantService";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request }) => {
    const firebase = FirebsaeAdminService.getInstance();
    const rag = new QdrantService(firebase.get_uid());
    const notebooks = await rag.get_notebooks();
    return new Response(JSON.stringify(notebooks), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};