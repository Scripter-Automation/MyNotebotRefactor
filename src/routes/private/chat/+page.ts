
import ContextService from "$lib/Services/Client/ContextService";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    
    
    const context_service = new ContextService(fetch);
    await context_service.get_context();


    return {
        context_service
    }

};