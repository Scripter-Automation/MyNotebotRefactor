import FirebsaeAdminService from "$lib/Services/firebaseAdminService";
import QdrantService from "$lib/Services/qdrantService";
import type { RequestHandler } from "@sveltejs/kit";


export const POST:RequestHandler = async ({ request, cookies }) => {
    const data = await request.json();
    const firebase = await FirebsaeAdminService.getInstance();
    const rag = new QdrantService(firebase.get_uid(await firebase.getUser(cookies.get("email"))));
    let notes;
    try{
        notes = await rag.get_all_notes();
        var res:any = new Map();
        notes.forEach((item)=>{
            if(!res.has(item.sectionId)){
                res.set(item.sectionId,[]);
            }
            res.get(item.sectionId).push(item);
        });
        res = Array.from(res);
    }catch(error){
        console.error(error);
        return new Response(null,{
            status:400,
            headers:{
                'Content-Type':'text/plain'
            }
        });
    }
    return new Response(JSON.stringify(res),{
        status: 200,
        headers:{
            'Content-Type':'text/plain'
        }
    });
};
