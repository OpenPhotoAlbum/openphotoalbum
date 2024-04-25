import { useEffect } from "react";
import { useFetch } from "../hooks/useFetch";

const SubjectsSelect = (props: { value: string, onChange: (subjectId: string) => void, reload?: any }) => {
    const { onChange, value, reload } = props;

    const { data, isPending, refetch } = useFetch<string[]>(
        'http://10.0.0.15:9447/subjects/'
    );
    
    useEffect(() => {
        if (!reload) {
            refetch()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload])

    return (
        <select disabled={isPending} value={value} onChange={e => onChange(e.target.value)}>
            <option hidden value="">--</option>
            {data?.sort().map((s: string, i: number) => (
                <option key={i} value={s}>{
                    s.split('_').map(a => a[0].toUpperCase() + a.substring(1)).join(' ')
                }</option>
            ))}
        </select>
    );
}

export default SubjectsSelect;