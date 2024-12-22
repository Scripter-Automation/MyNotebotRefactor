import FirebaseService from "$lib/firebaseService";
import OpenAIService from "$lib/OpenAIService";
import QdrantService from "$lib/qdrantService";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {

    const data = await request.json();
    const openai = new OpenAIService();
    const firebase = new FirebaseService();
    const rag = new QdrantService(firebase.get_uid());
    const embeding = await openai.generate_embeding(data.prompt);

    const query = await rag.get_context(data.context, data.public_context,embeding);
    console.log(query?.points[0].payload);
    const context = `
    <context>
        Estas siendo utilizado como una aplicación de rag, donde se tiene almacenado
        información de tus interacciones previas. Te estoy dando las respuestas de lo que has
        contestado anteriormente para que puedas tener una conversación más fluida. Usa la informacion
        dentro de messages para contestar a la pregunta en user_prompt. Si ya has contestado que no sabes,
        intenta utilizar el prompt dentro de messages para contestar a la pregunta. Si el usuario te dice
        que recuerdes algo solo dile que haras tu mejor esfuerzo para recordarlo.
        <messages>
            ${JSON.stringify(query?.points[0].payload)}
        </messages>
    </context>
    <user_prompt>
        ${data.prompt}
    </user_prompt>
    `
    console.log(context);
    const res = await openai.chat([{role:"user", content:context}]);

    return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });

};

