import React, { ChangeEventHandler, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelection } from "use-selection-hook";

import useScans from "../hooks/useScans";
import SubjectsSelect from "../components/SubjectsSelect/SubjectsSelect";
import { DetectedFace, Face, RecognizedFace, SubjectId } from "../lib/Scans";
import Button from "../components/Button/Button";
import useSubjects from "../hooks/useSubjects";
import { toast_config } from "../App";
import "./Scans.styles.scss";
import * as api from "../util/api-routes";
import DateBadge from "../components/Badges/DateBadge";
import FaceImage from "../components/FaceImage/FaceImage";

const Scans = () => {
  const [faceType, setFaceType] = useState<boolean>(false);

  const { faces } = useScans();
  // const scanLimit = 2000;

  // const { selection, toggleSelection, isSelected, toggleSelectionAll } =
  //   useSelection([]);

  const faceArray = Object.entries(faces.data?.data || {});
  const limit = 1000;

  console.log(faceArray);

  useEffect(() => {
    faces.get(faceType ? "detected" : "recognized", { limit });
    // getAllScans({
    //   limit: scanLimit,
    //   withDetections: faceType,
    //   withRecognitions: !faceType,
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceType, limit]);

  const handleOnToggleFaceType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { checked },
    } = e;
    setFaceType(checked);
  };

  // console.log({ scans });

  const addItem = (face: Face) => {
    // setData((data) => [...data, { id: (++globalIdCounter).toString() }]);
  };

  return (
    <section id="ScansPage" className="Page">
      {/* <ScansPageHeader onToggleFaceType={handleOnToggleFaceType} /> */}
      <main>
        <header>
          {/* @ts-ignore */}
          {faces?.data?.subtotal}/{limit} total faces of {faces?.data?.total}
        </header>
        <div className="ScansFaceListWrapper">
          {faceArray.map(([k, v]) => (
            <div className="ScansFaceList">
              <h2>{k}</h2>
              <figure className="FaceFlexWrap">
                {/* @ts-ignore */}
                {v.map((face, i) => (
                  <FaceImage
                    key={i}
                    title={face.gender.value}
                    src={api.API_GET_IMAGE_FILE_URI(face.image)}
                    relative
                    rounded={false}
                    size={"medium"}
                  />
                ))}
              </figure>
              <figcaption>
                {/* <DateBadge plain val={scan.exif.CreateDate} /> */}
                {/* {scan.exif.SourceFile && (
                  <a
                    href={api.API_GET_IMAGE_FILE_URI(scan.exif.SourceFile)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source
                  </a>
                )} */}
              </figcaption>
            </div>
          ))}
        </div>
      </main>
      <footer className="Page_Footer"></footer>
    </section>
  );
};

const ScansPageHeader = (props: {
  onToggleFaceType: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { onToggleFaceType } = props;

  const {
    add: {
      subject: addSubject,
      status: addSubjectStatus,
      data: addSubjectData,
    },
  } = useSubjects();

  const [subjectId, setSubjectId] = useState<SubjectId>("");
  const [newSubjectId, setNewSubjectId] = useState<SubjectId>("");

  const handleAddPerson = async () => {
    const { status } = await addSubject({
      subjectId: newSubjectId.replace(" ", "_").toLocaleLowerCase(),
    });
    if (status === 200) {
      toast.success("Successfully deleted", toast_config);
    }
  };

  return (
    <header className="Page_Header">
      <div>
        <div className="InputWrap">
          <SubjectsSelect onChange={setSubjectId} value={subjectId} />
          <Button
            variant="primary"
            disabled={!subjectId}
            onClick={handleAddPerson}
          >
            Add Face
          </Button>
        </div>
        <div className="InputWrap">
          <input
            value={newSubjectId}
            onChange={({ target: { value } }) => setNewSubjectId(value)}
            placeholder="Add new person"
          />
          <Button
            variant="primary"
            disabled={!newSubjectId}
            onClick={handleAddPerson}
          >
            Add New Person
          </Button>
        </div>
        <div className="InputWrap">
          <label className="ToggleCheckbox">
            <input
              type="checkbox"
              name="detected"
              onChange={onToggleFaceType}
            />
            <span>Detections</span>
            <span>Recognitions</span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Scans;
