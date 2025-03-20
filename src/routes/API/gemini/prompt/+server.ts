import type { RequestHandler } from "@sveltejs/kit";


export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    throw new Error('Method not implemented.');
    return new Response(JSON.stringify(data), {});
}