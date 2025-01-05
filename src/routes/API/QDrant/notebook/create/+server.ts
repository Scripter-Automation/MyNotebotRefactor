import OpenAIService from "$lib/OpenAIService";
import type { RequestHandler } from "@sveltejs/kit";
import QdrantService from "$lib/qdrantService";
import FirebsaeAdminService from "$lib/firebaseAdminService";


export const POST: RequestHandler = async ({ request }) => {
    const firebase = FirebsaeAdminService.getInstance();
    const data = await request.json();
    const rag = new QdrantService(firebase.get_uid());
    rag.create_notebook(data.id,data.title,data.topic,data.description);

    return new Response(null, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};