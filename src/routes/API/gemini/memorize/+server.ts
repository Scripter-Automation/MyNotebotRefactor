import GeminiService from "$lib/Services/Server/GeminiService";
import { SchemaType, type GenerateContentRequest, type Schema, type TextPart } from "@google/generative-ai";
import { text, type RequestHandler } from "@sveltejs/kit";
import type { Memory } from "../../../../types";
import APIService from "$lib/SDK/APIService";
import OpenAIService from "$lib/Services/Server/OpenAIService";


export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    console.log("Passed memories",data.memories)
    const memory_schema =         {
        type: SchemaType.OBJECT,
        properties: {
         text:{
             type:SchemaType.STRING,
             description: "El contenido textual de la memoria",
             nullable:false,
         },
         new_memory:{
             type:SchemaType.BOOLEAN,
             description:"Determina si es una memoria nueva o una actualización de una memoria existente. true para nueva, false para existente",
             nullable:false,
         }
        },
        required: ["text", "new_memory"]
     } as Schema
     
    let gemini:GeminiService 
    if(data.forceUpdate){
        gemini = new GeminiService(
            `
                Tienes el rol de simular a un cerebro. Por lo cual debes generar memorias de conversaciones como lo haria una persona.
                Si te dan recomendaciones debes de poder recordar cuales fueron estas recomendaciónes para poderlas usar en el futuro.
                Debes darle prioridad a recordar hechos, fechas, nombres, lugares, y cualquier información que pueda ser relevante en el futuro.
                Tienes un maximo de 500 palabras por memoria
                Tienes que buscar almacenar la mayor cantidad de informacion y detalles posibles.
                Se te va a pasar una memoria basado en una busqueda de similitud, 
                la cual debes actualizar para incluir la información anterior y la información entrante, o sobre escribir información unicamente cuando sea necesario
                Siempre crea la memoria en el mismo idioma que usa el usuario.
            `,
            memory_schema
        );

    }else{

        gemini = new GeminiService(
            `
                Tienes el rol de simular a un cerebro. Por lo cual debes generar memorias de conversaciones como lo haria una persona.
                Si te dan recomendaciones debes de poder recordar cuales fueron estas recomendaciónes para poderlas usar en el futuro.
                Debes darle prioridad a recordar hechos, fechas, nombres, lugares, y cualquier información que pueda ser relevante en el futuro.
                Tienes un maximo de 500 palabras por memoria
                Tienes que buscar almacenar la mayor cantidad de informacion y detalles posibles.
                Se te va a pasar una memoria basado en una busqueda de similitud, la cual debes de decidir si actualizar para conserver el conteinido de la memoria
                para que este incluya el conocimiento previo y el actualizado ó puedes tomar la decision de crear una nueva memoria si los temas difieren mucho
                Siempre crea la memoria en el mismo idioma que usa el usuario.
            `,
            memory_schema
        );
    }

    const input:GenerateContentRequest = {
        contents: [
            {role: "model", parts: [{text: `**Memoria de la conversación:** ${typeof data.memories === "string" ? data.memories : JSON.stringify(data.memories as string)}`} as TextPart]},
            {role:"user", parts:[{text:data.prompt as string} as TextPart]},
            {role:"model", parts:[{text:data.response as string} as TextPart]},
        ],
    };

    const response = await gemini.prompt(input);

    console.log("Gemini response memories",response.candidates![0].content.parts);
    const values = JSON.parse(response.candidates![0].content.parts[0].text as string) as {text:string, new_memory:boolean};
    const embeding = await new OpenAIService().generate_embeding(values.text)
    
    let result:Memory;
    if((values.new_memory || typeof(data.memories)== "string") && !data.forceUpdate){
        result = {
            id: APIService.generate_UID(),
            text: values.text,
            embeding: embeding,
            saved: false
        }
    }else{
        data.memories.text = values.text
        data.memories.embeding = embeding;
        result = data.memories;
    }

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}