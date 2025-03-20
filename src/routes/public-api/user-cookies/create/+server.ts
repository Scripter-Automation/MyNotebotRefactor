import FirebaseAdminService from "$lib/Services/Server/FirebaseAdminService";
import QdrantService from "$lib/Services/Server/QdrantService";
import { type RequestHandler } from "@sveltejs/kit";
import {v4 as uuid4} from 'uuid';

export const POST: RequestHandler = async ({request, cookies})=>{

    console.log("here")
    const body = await request.json();
    cookies.set("email",body.email,{
        path:"/",
        httpOnly:true,
        secure:true,
        maxAge: 60*60*24
    });
    let cookie ;
    try{
        const firebase = await FirebaseAdminService.getInstance();
        await firebase.validate_token(body.token)
        cookie = await firebase.create_session_cookie(body.token);
        if(body.register){
            const qdrant = new QdrantService(firebase.get_uid(await firebase.getUser(cookies.get("email"))));
            await qdrant.createCustomerCollection();
            const notebook_id = uuid4();
            await qdrant.create_notebook(notebook_id,"General","General","This is the default notebook, where all your notes will be stored when no notebook context is defined");
            await qdrant.create_section(uuid4(),notebook_id,"General","Default section","This is the default section for the default notebook");
        }
        
    }catch(error){
        console.error("error ocurred when creating cookie")
        console.error(error);
        cookies.delete("email",{path:"/"});
        return new Response(null,{
            status:500,
            headers:{
                'Content-Type':'text/plain'
            }
        })
    }

    cookies.set("token",cookie,{
        path:"/",
        httpOnly:true,
        secure:true,
        maxAge: 60*60*24
    });

    return new Response(null,{
        status:200,
        headers:{
            'Content-Type':'text/plain'
        }
    });

}