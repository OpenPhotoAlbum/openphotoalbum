import { useEffect } from "react";
import useSubjects from "../../hooks/useSubjects";

const SubjectsSelect = (props: { value: string, onChange: (subjectId: string) => void, reload?: any }) => {
    const { onChange, value } = props;

    const { getAll: { subjects: getAllSubjects, data, isLoading } } = useSubjects();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getAllSubjects(); }, []);
    console.log({data})
    return (
        <select disabled={isLoading} value={value} onChange={e => onChange(e.target.value)}>
            <option value="">Select person</option>
            {data?.sort().map((s: string, i: number) => (
                <option key={i} value={s}>{
                    s.split('_').map(a => a[0].toUpperCase() + a.substring(1)).join(' ')
                }</option>
            ))}
        </select>
    );
}

export default SubjectsSelect;