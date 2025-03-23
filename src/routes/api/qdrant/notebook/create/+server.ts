import OpenAIService from "$lib/Services/Server/OpenAIService";
import type { RequestHandler } from "@sveltejs/kit";
import QdrantService from "$lib/Services/Server/QdrantService";
import FirebsaeAdminService from "$lib/Services/Server/FirebaseAdminService";

/**
 * Seria buena idea que se creara tambien un embeding de la descripcion
 * del cuaderno, para que asi se puedan hacer sugerencias como recomiendo 
 * utilizar este cuaderno para guardar las cosas
 */

export const POST: RequestHandler = async ({ request, cookies }) => {
    const firebase = await FirebsaeAdminService.getInstance();
    const data = await request.json();
    const rag = new QdrantService(firebase.get_uid(await firebase.getUser(cookies.get("email"))));
    rag.create_notebook(data.id,data.title,data.topic,data.description);

    return new Response(null, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};