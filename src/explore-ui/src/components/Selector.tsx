import { useEffect, useState } from "react";
import './Selector.styles.scss';

type SelectorType = {
    data: { image: string, subjectId: string}[],
    onChange: (selections: any[]) => void,
    children: any
}

const Selector = (props: SelectorType) => {
    const { data, children, onChange } = props;
    const [ selections, setSelections ] = useState<any>({});

    useEffect(() => {
        onChange(selections)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selections]);

    const handleCheckboxChange = (d: any) => {
        console.log(d)
        // const isChecked = e.target.checked;
        // let _selections = {...selections};

        // if (isChecked) {
        //     if (_selections[d.jsonFile]) {
        //         _selections[d.jsonFile].push(f.image)
        //     } else {
        //         _selections[d.jsonFile] = [f.image]
        //     }
        // } else {
        //     if (_selections[d.jsonFile]) {
        //         const _tmp = _selections[d.jsonFile];
        //         const i = _tmp.indexOf(f.image)
        //         _tmp.splice(i,1)
        //         _selections = {
        //             ..._selections,
        //             [d.jsonFile]: _tmp
        //         }
        //         if (_selections[d.jsonFile].length === 0) {
        //             delete _selections[d.jsonFile];
        //         }
        //     }
        // }
        // setSelections(_selections)
    }

    return (
        <div className="Selector">
            <div className="SelectorWrapper">
                { data?.map((d: any, i: any) => (
                    <label key={d.image} className="SelectorLabel">
                        <input
                            type="checkbox"
                            name="subject"
                            hidden
                            checked={selections[d.jsonFile]?.includes(d.image) || false}
                            onChange={(e) => handleCheckboxChange(d)}
                            data-image={d.image}
                            data-json={d.jsonFile}
                        />
                        {children(d)}
                    </label>
                ))
                }
            </div>
        </div>
    )
}

export default Selector;