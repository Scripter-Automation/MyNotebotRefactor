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
            Tu proposito es generar memorias que seran almacenadas en una base de datos de vectores. Por lo tanto
            si crees que el tema de la conversación esta cambiando, ó si el resumen de la conversación es
            demasiado largo debes sugerir que se cree una nueva memoria.
            En caso de sugerir una nueva memoria, debes de indicar que se debe crear un resumen nuevo empezando
            desde la nueva interacción de la conversación.

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
                },
                new_memory:{
                    type: SchemaType.BOOLEAN,
                    description: "Indica si se debe de crear una nueva memoria",
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