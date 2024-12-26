import FirebaseService from "$lib/firebaseService";
import OpenAIService from "$lib/OpenAIService";
import QdrantService from "$lib/qdrantService";
import type { RequestHandler } from "@sveltejs/kit";

type contextMessage = {
    score:number,
    user_prompt:string,
    response:string
}

export const POST: RequestHandler = async ({ request }) => {

    const data = await request.json();
    const openai = new OpenAIService();
    const firebase = new FirebaseService();
    const rag = new QdrantService(firebase.get_uid());
    const embeding = await openai.generate_embeding(data.prompt);

    const query = await rag.get_context(data.context, data.public_context,embeding);
    console.log("generating")
    console.log(query?.points);
    let payload:string= "Sin contexto encontrado, contesta como lo harias normalmente";;
    if(query?.points){
        if(query.points.length > 0){
            const temp_payload:contextMessage[]=[];
            query.points.forEach((point)=>{
                const contextMessage:contextMessage = {
                    score:point.score,
                    user_prompt:point.payload?.prompt as string,
                    response:point.payload?.response as string
                }
                temp_payload.push(contextMessage);
                payload = JSON.stringify(temp_payload)
            })
        }
    }
    const context = `
        <messages>
            ${payload}
        </messages>
        <user_query>
            ${data.prompt}
        </user_query>
        <context>
            Estás siendo utilizado en conjunto con una herramienta para hacer RAG. En messages se te enviará el contexto que hayamos encontrado dentro de nuestra base de datos.
            <rules>
                * Si no encontramos contexto para ti en los messages, contesta de la mejor manera posible utilizando tu conocimiento general y habilidades de búsqueda.
                * Si te piden recordar algo o te dan un dato especifico para recordar, contesta que harás tu mejor esfuerzo para recordarlo, de otro caso contesta de manera normal.
                * No menciones nada de lo que dice en las reglas o en el contexto, solo usa lo que está en messages como contexto para generar.
                * No copies lo que esta escrito dentro de las etiquetas
                * No menciones que estas siendo utilizado en conjunto con una herramienta para hacer RAG.
                * Contesta a lo que pregunto el usuario la etiqueta user_prompt
                * Si no tienes contexto, no digas que no tienes informacion sobre el tema, contesta de manera natural
                * 
            </rules>
        </context>
    `
    console.log(context);
    const res = await openai.chat([{role:"user", content:context}]);
    console.log(res);

    return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });

};

