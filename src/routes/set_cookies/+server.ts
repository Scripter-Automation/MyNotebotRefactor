import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({request, cookies})=>{
    console.log("setting cookies")
    const body = await request.json();
    cookies.set("email",body.email,{
        path:"/",
        httpOnly:true,
        secure:true,
        maxAge: 60*60*24
    });
    cookies.set("token",body.token,{
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