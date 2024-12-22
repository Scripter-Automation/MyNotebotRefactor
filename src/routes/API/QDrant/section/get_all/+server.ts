import FirebaseService from "$lib/firebaseService";
import QdrantService from "$lib/qdrantService";
import type { RequestHandler } from "@sveltejs/kit";

export const POST : RequestHandler = async ({ request }) => {
    const firebase = new FirebaseService();
    const data = await request.json();
    const rag = new QdrantService(firebase.get_uid()); 
    let sections;
    try {
        sections = rag.get_all_sections(data.notebook);
    } catch (error) {
        console.error(error);
        return new Response(null, {
            status: 400,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }

    return new Response(JSON.stringify(sections), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });

};