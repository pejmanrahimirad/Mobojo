import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Button,
  Progress,
} from "reactstrap";
import "./media.css";
import { AuthContext } from "src/context/auth/authContext";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import { checkType,maxSelectedFile ,checkFileSize} from "./Funcs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddMedia = (props) => {
  const [loadedFiles, setLoadedFiles] = useState([]);
  const { dispatch } = useContext(AuthContext);
  useEffect(() => {
    dispatch({ type: "check", payload: props });
  }, []);
  const onFilesLoad = (event) => {
    if (checkType(event) &&maxSelectedFile(event)&&checkFileSize(event)) {
      const files = event.target.files;
      const newLoadedFiles = [...loadedFiles];
      for (let index = 0; index < files.length; index++) {
        const element = files[index];
        newLoadedFiles.push({
          file: element,
          preview: URL.createObjectURL(element),
          loaded: 23,
        });
      }
      setLoadedFiles(newLoadedFiles);
    }
  };

  const removefile = (remove) => {
    const files = loadedFiles.filter((item) => item != remove);
    setLoadedFiles(files);
  };
  const onDragOverHandler=(event)=>{
      event.preventDefault();

  }
  const onDropHandler=(event)=>{
      event.preventDefault();
      const files=event.dataTransfer.files
      const newLoadedFiles = [...loadedFiles];
      for (let index = 0; index < files.length; index++) {
        const element = files[index];
        newLoadedFiles.push({
          file: element,
          preview: URL.createObjectURL(element),
          loaded: 23,
        });
      }
      setLoadedFiles(newLoadedFiles);
  }
  return (
    <div className="animated fadeIn">
      <ToastContainer />
      <Card>
        <CardHeader>
          <h6>اضافه کردن پرونده چند رسانه ای</h6>
        </CardHeader>
        <CardBody>
          <div className="addMediaSection"
          onDragOver={onDragOverHandler}
          onDrop={onDropHandler}
          >
            <div className="filePreview">
              {loadedFiles.map((file, index) => {
                return (
                  <div className="file" key={index}>
                    <span className="removeIcon">
                      <CIcon
                        icon={cilTrash}
                        size="xl"
                        onClick={() => removefile(file)}
                      />
                    </span>
                    <img src={file.preview} alt={file.file.name} />
                    <span>size : {file.file.size}</span>

                    <Progress bar max={100} color="success" value={file.loaded}>
                      {Math.round(file.loaded)}%
                    </Progress>
                  </div>
                );
              })}
            </div>
            <div className="drapdropSection">
              <h3>پرونده ها را اینجا بکشید</h3>
              <span>یا</span>
              <Form className="form-horizontal">
                <FormGroup row>
                  <label htmlFor="file-multiple-input">
                    <div className="fileSelection">گزینش پرونده</div>
                  </label>
                  <Input
                    type="file"
                    id="file-multiple-input"
                    name="file-multiple-input"
                    multiple
                    onChange={onFilesLoad}
                  />
                </FormGroup>
              </Form>
            </div>
          </div>
        </CardBody>
        <CardFooter className="footer">
          <Button type="submit" size="xl" color="primary">
            <strong>آپلود</strong>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddMedia;
