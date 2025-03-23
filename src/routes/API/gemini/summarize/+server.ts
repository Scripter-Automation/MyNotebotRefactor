import GeminiService from "$lib/Services/Server/GeminiService";
import { SchemaType, type GenerateContentRequest, type Schema, type TextPart } from "@google/generative-ai";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const gemini = new GeminiService(
        `
            Eres una heramienta para generar resumenes de conversaciones,
            debes de ser capaz de tomar un resumen anterior de la conversación, procesar
            la nueva interacción de la conversación y generar un resumen actualizado de la conversación.
            Debes de captar la mayor cantidad de detalle en la menor cantidad de texto posible. Ya que el resumen que 
            vas a generar sera enviado a otro LLM para recordar lo que ha sucedido en la conversación.

            Siempre contesta en el mismo idioma que el usuario

            **Resumen de la conversación anterior:**
            ${data.summary as string}
        `,
        {
            type: SchemaType.OBJECT,
            description: "Resumen de una conversación",
            properties: {
                summary: {
                    type: SchemaType.STRING,
                    description: "Resumen de una conversación",
                    nullable: false
                }
            }
        } as Schema
    );

    const input:GenerateContentRequest = {
        contents: [
            {role:"user", parts:[{text:data.prompt as string} as TextPart]},
            {role:"model", parts:[{text:data.response as string} as TextPart]},
        ],
    };

    const response = await gemini.prompt(input);

    console.log("Gemini response",response.candidates![0].content.parts);

    return new Response(JSON.stringify(response.candidates![0].content.parts), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}