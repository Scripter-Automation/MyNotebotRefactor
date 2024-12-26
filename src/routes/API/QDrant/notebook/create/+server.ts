import OpenAIService from "$lib/OpenAIService";
import type { RequestHandler } from "@sveltejs/kit";
import FirebaseService from "$lib/firebaseService";
import QdrantService from "$lib/qdrantService";


export const POST: RequestHandler = async ({ request }) => {
    const firebase = new FirebaseService();
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