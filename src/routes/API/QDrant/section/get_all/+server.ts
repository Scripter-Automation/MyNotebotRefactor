import FirebaseAdminService from "$lib/Services/firebaseAdminService";
import QdrantService from "$lib/Services/qdrantService";
import type { RequestHandler } from "@sveltejs/kit";

export const POST : RequestHandler = async ({ request,cookies }) => {
    const firebase = await FirebaseAdminService.getInstance()
    const data = await request.json();
    const rag = new QdrantService(firebase.get_uid(await firebase.getUser(cookies.get("email"))));
    let sections;
    try {
        sections = await rag.get_all_sections();
        var res:any = new Map();
        sections.forEach((item)=>{
            if(!res.has(item.notebookId)){
                res.set(item.notebookId,[]);
            }
            res.get(item.notebookId).push(item);
        })
        res = Array.from(res);
        console.log(res);
    } catch (error) {
        console.error(error);
        return new Response(null, {
            status: 400,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }

    return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });

};