import { redirect, type Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import FirebaseAdminService from '$lib/Services/firebaseAdminService';

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
    
    const firebaseAdmin = await FirebaseAdminService.getInstance();
    if(event.url.pathname === "/"){
        const response = await resolve(event);
        return response;
    }

    const email = event.cookies.get("email")
    const token = event.cookies.get("token")

    if (email && token) {
        
        const idToken = await firebaseAdmin.verifySessionCookie(token);
        console.log(idToken);
        //console.log(idToken.exp*1000 > Date.now())
        //console.log(new Date(idToken.exp*1000).toUTCString())
        if ( idToken.exp*1000 < Date.now() && (event.url.pathname.startsWith("/Private") || event.url.pathname.startsWith("/API"))) {
            console.log("Access denied due to expired token")
            event.cookies.delete("email",{path:"/"});
            event.cookies.delete("token", {path:"/"});
            throw redirect(303, "/")
            
        }

        if(event.url.pathname.startsWith("/API/cookies/delete_user_cookies")){
            console.log("revokeing session")
            firebaseAdmin.revokeSession(idToken.uid);
            console.log("session revoked")
        }
    } else {
        console.log("Missing email or token in cookies");
        if (event.url.pathname.startsWith("/Private") || event.url.pathname.startsWith("/API")) {
            throw redirect(303, "/")
        }
    }
    
    console.log("Passed middleware");
    const response = await resolve(event);
    return response;

};
