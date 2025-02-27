import FirebaseAdminService from "$lib/Services/Server/FirebaseAdminService";
import QdrantService from "$lib/Services/Server/QdrantService";
import type { RequestHandler } from "@sveltejs/kit";
import {v4 as uuid4} from 'uuid';


export const POST: RequestHandler = async ({ request,cookies }) => {
    const firebase = await FirebaseAdminService.getInstance();
    const qdrant = new QdrantService(firebase.get_uid(await firebase.getUser(cookies.get("email"))));
    await qdrant.createCustomerCollection();
    const notebook_id = uuid4();
    await qdrant.create_notebook(notebook_id,"General","General","This is the default notebook, where all your notes will be stored when no notebook context is defined");
    await qdrant.create_section(uuid4(),notebook_id,"General","Default section","This is the default section for the default notebook");

    return new Response(null, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};
