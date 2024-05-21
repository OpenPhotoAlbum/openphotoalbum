import db from '.';

export const addFace = async (data) => {
    try {
        const r = await db('faces').insert({
            subject_id: 1,
            path: '',
            verified: false
        });
        return r[0];
    } catch (e) {
        console.error(e);
    }
}
