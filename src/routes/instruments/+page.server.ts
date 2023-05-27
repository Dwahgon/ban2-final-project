import { fail, type Actions } from "@sveltejs/kit";
import RecorderController from "../../controller/RecorderController";
import Instrumento from "../../model/Instrumento";

export const load = async () => ({
    instrumentos: (await RecorderController.instance.getAllInstrumentos()).map(instrumento => instrumento.toJson())
})

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        console.log(Object.fromEntries(formData.entries()));

        try {
            const instrumento = Instrumento.fromFormData(formData)
            if (instrumento.idInstrumento)
                await RecorderController.instance.updateInstrumento(instrumento);
            else
                await RecorderController.instance.insertIntrumento(instrumento);
            return { success: true, edited: instrumento.idInstrumento !== undefined }
        } catch (error) {
            return fail(400, { error: (error as Error).message });
        }
    }
} satisfies Actions;