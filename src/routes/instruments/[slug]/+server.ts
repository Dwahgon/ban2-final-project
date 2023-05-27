import { error, json } from '@sveltejs/kit';
import RecorderController from '../../../controller/RecorderController.js';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ params }): Promise<Response> => {
    const id = params.slug;
    console.log(`deleted instrumento ${id}`);
    try {
        await RecorderController.instance.deleteInstrumento(Number(id));
    } catch (err) {
        throw error(400, {
            message: (err as Error).message
        });
    }
    return json({ success: true });
}) satisfies RequestHandler;