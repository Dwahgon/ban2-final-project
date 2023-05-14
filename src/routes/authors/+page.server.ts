import { fail } from "@sveltejs/kit";
import RecorderController from "../../controller/RecorderController";
import { Banda, Musico } from "../../model/Autores";

export const load = async () => ({
    autores: (await RecorderController.instance.getAllAutores()).map(autor => autor.toJson())
})

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        console.log(Object.fromEntries(formData.entries()));

        // Get and validate autor.tipo
        const tipo = String(formData.get('tipo') || '');
        if (tipo == '') return fail(400, { tipo, missing: true });
        if (tipo != 'm' && tipo != 'b') return fail(400, { tipo, invalid: true });


        try {
            // Insert Autor
            const autor = String(tipo) == 'm' ? Musico.fromFormData(formData) : Banda.fromFormData(formData, await RecorderController.instance.getAllMusicos());
            if (autor.idAutor)
                await RecorderController.instance.updateAutor(autor);
            else
                await RecorderController.instance.insertAutor(autor);
            return { success: true, edited: autor.idAutor !== undefined }
        } catch (error) {
            return fail(400, { error: (error as Error).message });
        }

    }
}