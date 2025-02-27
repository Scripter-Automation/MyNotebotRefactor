import { redirect, type Handle } from '@sveltejs/kit';
import FirebaseAdminService from '$lib/Services/Server/FirebaseAdminService';

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
    // Crea una instancia global de FirebaseAdminService utilizando el 
    // patron de diseño Singleton
    const firebaseAdmin = await FirebaseAdminService.getInstance();
    
    // Si es la pagina principal, no se necesita verificar el token
    if(event.url.pathname === "/"){
        const response = await resolve(event);
        return response;
    }

    // Obtiene el email y el token de las cookies
    const email = event.cookies.get("email")
    const token = event.cookies.get("token")

    // Si existe el email y el token, verifica el token
    if (email && token) {

        let idToken
        try{
            // Verifica el token
            idToken = await firebaseAdmin.verifySessionCookie(token);

        }catch(error){
            // Si el token no es valido, elimina las cookies y redirige al usuario a la pagina principal
            console.error(error);
            event.cookies.delete("email",{path:"/"});
            event.cookies.delete("token", {path:"/"});
            throw redirect(303, "/")
        }
        //console.log(idToken);
        //console.log(idToken.exp*1000 > Date.now())
        //console.log(new Date(idToken.exp*1000).toUTCString())
        // Si el token ha expirado y el usuario intenta acceder a una pagina privada, elimina las cookies y redirige al usuario a la pagina principal
        if ( idToken.exp*1000 < Date.now() && (event.url.pathname.startsWith("/private") || event.url.pathname.startsWith("/api"))) {
            console.log("Access denied due to expired token")
            event.cookies.delete("email",{path:"/"});
            event.cookies.delete("token", {path:"/"});
            throw redirect(303, "/")    
        }

        // Si el usuario intenta cerrar sesion, elimina las cookies y revoca la sesion
        if(event.url.pathname.startsWith("/API/cookies/delete_user_cookies")){
            firebaseAdmin.revokeSession(idToken.uid);
        }

    } else {
        // Si no existe el email o el token y se intenta acceder a una ruta privada, elimina las cookies y redirige al usuario a la pagina principal
        console.log("Missing email or token in cookies");
        if (event.url.pathname.startsWith("/private") || event.url.pathname.startsWith("/api")) {
            event.cookies.delete("email",{path:"/"});
            event.cookies.delete("token", {path:"/"});
            throw redirect(303, "/")
        }
    }
    // Si pasa todas las verificaciones, continua con la ejecucion de la aplicacion
    console.log("Passed middleware");
    const response = await resolve(event);
    return response;

};
