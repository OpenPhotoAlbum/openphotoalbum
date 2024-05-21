import db from '.';

type SubjectModal = {
    first_name?: string,
    last_name?: string,
    middle_name?: string,
    maiden_name?: string,
    suffix?: string,
}
export const getSubjectRows = async () => {
    try {
        const subjects = await db<SubjectModal>('subjects').select('*');
        return subjects;
    } catch (e) {
        console.error(e);
    }
}
export const addSubjectRow = async (data: SubjectModal) => {
    try {
        const r = await db('subjects').insert(data);
        return r[0];
    } catch (e) {
        console.error(e);
    }
}