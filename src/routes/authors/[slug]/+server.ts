import { error, json } from '@sveltejs/kit';
import RecorderController from '../../../controller/RecorderController.js';
import type { RequestHandler } from './$types.js';

export const DELETE = (async ({ params }): Promise<Response> => {
    console.log('deleted');
    const id = params.slug;
    try {
        await RecorderController.instance.deleteAutor(Number(id));
    } catch (err) {
        throw error(400, {
            message: (err as Error).message
        });
    }
    return json({ success: true });
}) satisfies RequestHandler;