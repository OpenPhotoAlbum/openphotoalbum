import { useEffect } from "react";
import useSubjects from "../hooks/useSubjects"

const Detected = () => {
    const { getAll, add, removeSubjectExample, addSubjectExample } = useSubjects();
    // console.log({ subjects, getSubjects, isGetSubjectsIsLoading, getSubjectsError, getSubjectsStatus })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getAll.subjects(); }, []);

    return (
        <h1>hello</h1>
    )
}

export default Detected;