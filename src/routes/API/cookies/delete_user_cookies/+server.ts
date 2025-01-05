import { redirect, type RequestHandler } from "@sveltejs/kit";


export const POST: RequestHandler = async ({request, cookies})=>{
    cookies.delete("email",{
        path:"/"
    })
    cookies.delete("token",{
        path:"/"
    })
    throw redirect(303, "/")
}