import { redirect, type Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import FirebaseAdminService from '$lib/firebaseAdminService';

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
    
    if(event.url.pathname === "/"){
        const response = await resolve(event);
        return response;
    }

    const email = event.cookies.get("email")
    const token = event.cookies.get("token")

    if (email && token) {
        const firebaseAdmin = FirebaseAdminService.getInstance(email);
        const is_valid = await firebaseAdmin.validate_token(token);
        console.log("is_valid ", is_valid);

        if (!is_valid && (event.url.pathname.startsWith("/Private") || event.url.pathname.startsWith("/API"))) {
            throw redirect(303, "/")
            
        }
    } else {
        console.log("Missing email or token in cookies");
        if (event.url.pathname.startsWith("/Private") || event.url.pathname.startsWith("/API")) {
            throw redirect(303, "/")
        }
    }
    
    console.log("Passed");
    const response = await resolve(event);
    return response;

};
