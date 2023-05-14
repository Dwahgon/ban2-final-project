import { error, json } from '@sveltejs/kit';
import RecorderController from '../../../controller/RecorderController.js';

export async function DELETE({ params }): Promise<Response> {
    console.log('deleted');
    const id = params.slug;
    try {
        RecorderController.instance.deleteAutor(Number(id));
    } catch (err) {
        throw error(400, {
            message: (err as Error).message
        });
    }
    return json({ success: true });
}