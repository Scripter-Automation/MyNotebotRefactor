
import OpenAIService from "$lib/Services/Server/OpenAIService";

import { zodResponseFormat } from "openai/helpers/zod";
import type { RequestHandler } from "@sveltejs/kit";
import { notestructure } from "../../../../zodTypes";


type contextMessage = {
    score:number,
    user_prompt:string,
    response:string
}

export const POST: RequestHandler = async ({ request, cookies }) => {

    const data = await request.json();
    console.log("anotation data",data);
    const openai = new OpenAIService();

    
    

    const res = await openai.annotate([
        {role:"system", content:"You are a note generator, and are useing Editor.js to produce such notes. You will receive a previous version of a note as well as new input. You will then update the note useing any fitting tool. If you recive no previous note, then you will create one from scratch. When asked doing a to do list, use a checklist."},
        {role:"user", content:"Previous note in JSON format"+data.currentNote},
        {role:"user", content:"Incomeing input:"+data.memory}
    ], zodResponseFormat(notestructure,"NoteStructure")
    );
    console.log("anotation response",res);

    return new Response(JSON.stringify({res}), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });

};

