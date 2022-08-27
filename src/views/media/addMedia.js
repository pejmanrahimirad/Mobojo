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
import axios from "axios";
import "./media.css";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import { checkType, maxSelectedFile, checkFileSize } from "./Funcs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMedia = (props) => {
  const [loadedFiles, setLoadedFiles] = useState([]);
  const onFilesLoad = (event) => {
    if (checkType(event) && maxSelectedFile(event)) {
      //&& checkFileSize(event)
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
  const onDragOverHandler = (event) => {
    event.preventDefault();
  };
  const onDropHandler = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
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
  };

  const Upload = async () => {
    const tempLoadedFiles = [...loadedFiles];
    for (let index = 0; index < loadedFiles.length; index++) {
      const element = loadedFiles[index];
      if (element.loaded !== 100) {
        let data = {
          query: `
          mutation Mutation( $image : Upload!) {
            multimedia(image: $image) {
              status
              message
            }
          }`,
          variables: {
            "image": null,
          },
        };
        let map = {
          0: ["variables.image"]
        };
        const FormD = new FormData();
        FormD.append("operations", JSON.stringify(data));
        FormD.append("map", JSON.stringify(map));
        FormD.append(0, element.file, element.file.name);

     
        await axios({
          url: "/",
          method: "post",
          data: FormD,
          onUploadProgress: (ProgressEvent) => {
            tempLoadedFiles[index].loaded =
              (ProgressEvent.loaded / ProgressEvent.total) * 100;
          },
        })
          .then((response) => {
            console.log('res',response)
            if (response.data.errors) {
              const { message } = response.data.errors[0];
              toast.error(message);
            } else {
              setLoadedFiles(tempLoadedFiles);
            }
          })
          .catch((error) => {
            console.log("error is: ",error);
          });
      }
    }
  };
  return (
    <div className="animated fadeIn">
      <ToastContainer />
      <Card>
        <CardHeader>
          <h6>اضافه کردن پرونده چند رسانه ای</h6>
        </CardHeader>
        <CardBody>
          <div
            className="addMediaSection"
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
          <Button row  type="submit" size="xl" color="primary" onClick={Upload}>
            <strong>آپلود</strong>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddMedia;
