import FirebaseAdminService from "$lib/Services/Server/FirebaseAdminService";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({request, cookies})=>{
    
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
        console.log("cookie",cookie);
    }catch(error){
        console.log("error ocurred when creating cookie")
        console.error(error);
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