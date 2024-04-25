import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import "./Home.styles.scss";
import usePost from "../hooks/usePost";
import SubjectsSelect from "./SubjectsSelect";
import { Bounce, ToastContainer, ToastOptions, toast } from 'react-toastify';
import Selector from "./Selector";

const toast_config: ToastOptions = {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
};

const Home = () => {
    const query = {
        limit: 3000,
        withDetections: true,
    }
    // const images = useFetch<string[]>('http://10.0.0.15:9447/images/', query);
    const { data, isPending, error, refetch } = useFetch<any>('http://10.0.0.15:9447/scans/', query);
    const { makeRequest: addSubjectExamples } = usePost('http://10.0.0.15:9447/add_subject_examples/');
    const { makeRequest: addSubject, isLoading: isLoadingAddSubject } = usePost('http://10.0.0.15:9447/add_subject/');
    const { makeRequest: deleteDetections } = usePost('http://10.0.0.15:9447/delete/detected/subjects/');

    const [ subjectId, setSubjectId ] = useState<string>('');
    const [ newSubjectId, setNewSubjectId ] = useState<string>('');
    const [ selections, setSelections ] = useState<any>({});

    const clearInputs = () => {
        setSelections({});
        setNewSubjectId('');
        setSubjectId('')
    }

    const handleCheckboxChange = (d: any) => {
        console.log(d)
    }

    const removeFromListAndClear = (res:any) => {
        if (res?.status === 200) {
            res.data.successes.forEach((s: string) => {
                const label = document.querySelector(`input[data-image="${s}"]`)?.parentElement;
                label?.remove()
            })
        }
        clearInputs()
    }

    const handleDelete = async (event: any) => {
        event.preventDefault();
        const imgs = Object.entries(selections);
    
        const res = await deleteDetections(imgs);
        if (res.status === 200) {
            toast.success('Successfully deleted', toast_config);
        }
        removeFromListAndClear(res);
    }

    const handleAddExamples = async (event: any) => {
        event.preventDefault();
        let _subjects: any = [];

        Object.keys(selections).forEach((k: any) => {
            selections[k].forEach((image: string) => {
                _subjects.push({
                    image,
                    jsonFile: k
                })
            })
        });

    const res = await addSubjectExamples({ subjectId, subjects: _subjects })
        removeFromListAndClear(res);
        // deleteErrorsFromListAndClear(res)
        if (res.status === 200) {
            toast.success('Successfully added subject examples', toast_config);
        }
    }    
    
    const handleAddSubject = async () => {
        await addSubject({ subjectId: newSubjectId.replaceAll(' ', '_') })
        toast.success('Added new subject', toast_config);
        clearInputs()
    }
    
    const totalSelected = Object.values(selections).flat().length;

    return (
        <div id="Home">
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            { totalSelected > 0 &&
                <footer>
                    <button onClick={() => setSelections({})}>Clear Selection ({totalSelected})</button>
                </footer>
            }
            <div className="NewSubjectWrapper">
                <input value={newSubjectId} placeholder="New persons name" type="text" onChange={e => setNewSubjectId(e.target.value)}/>
                <button disabled={!newSubjectId} onClick={handleAddSubject}>Add New</button>
            </div>
            <form>
                <header>
                    <button onClick={() => window.location.reload}>#</button>
                    <SubjectsSelect value={subjectId} onChange={setSubjectId} reload={isLoadingAddSubject}/>
                    <button onClick={handleAddExamples} disabled={!subjectId}>ADD {totalSelected ? ` (${totalSelected})` : ''}</button>
                    <button onClick={handleDelete} style={{ background: '#f00', color: '#fff'}} >DELETE{totalSelected ? ` (${totalSelected})` : ''}</button>
                </header>
                <Selector onChange={s => handleCheckboxChange(s)} data={data?.data.map((d: any) => d.faces.detected).flat()}>
                    {/* @ts-ignore */}
                    {(data) => (
                        <React.Fragment>
                            <div
                                className="SubjectImage"
                                style={{
                                    backgroundImage: `url("http://10.0.0.15:9447/img${data.image}")`,
                                }}
                            ></div>
                            {/* <a href={`http://10.0.0.15:9447/img${data.exif.SourceFile}`} rel="noreferrer" target="_blank">FULL</a> */}
                        </React.Fragment>
                    )}
                </Selector>
                {/* <div className="SubjectImageListWrapper">
                    { !isPending &&
                        data?.data?.map((d: any) => {
                            return d.faces.detected
                            .map((f: any, i: any) => (
                                <label key={f.image} className="SubjectLabel">
                                    <input
                                        type="checkbox"
                                        name="subject"
                                        hidden
                                        checked={selections[d.jsonFile]?.includes(f.image) || false}
                                        onChange={(e) => handleCheckboxChange(e, d, f)}
                                        data-image={f.image}
                                        data-json={d.jsonFile}
                                    />
                                    <div
                                        className="SubjectImage"
                                        style={{
                                            backgroundImage: `url("http://10.0.0.15:9447/img${f.image}")`,
                                        }}
                                    ></div>
                                    <a href={`http://10.0.0.15:9447/img${d.exif.SourceFile}`} rel="noreferrer" target="_blank">FULL</a>
                                </label>
                            ))
                        })
                    }
                </div> */}
            </form>
        </div>
    )
}

export default Home;