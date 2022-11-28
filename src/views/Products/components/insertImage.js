import React from "react";

import { FormGroup, Col, Row, Label, Input } from "reactstrap";
import "../style.css";
const InsertImage = (props) => {
  const { image, imageServer } = props;
  return (
    <>
      <Col xs="3">
        <FormGroup row>
          <label htmlFor="file-multiple-input" className="file-dashed">
            {imageServer?
            <div className="fileSelection">ویرایش تصویر</div>
          :
          <div className="fileSelection">گزینش پرونده</div>
            
          }
          </label>
          <Input
            type="file"
            id="file-multiple-input"
            name="file-multiple-input"
            multiple
            onChange={props.onChange}
          />
        </FormGroup>
      </Col>
      {imageServer ?
          <Col xs="9" className="showImage">

        <img src={`${process.env.REACT_APP_PUBLIC_URL}${imageServer}`} alt={imageServer}
          className="previewImage"
        /> 
        </Col>
        :

        image ? (
          <Col xs="9" className="showImage">
            <img src={image} alt={image} className="previewImage" />
          </Col>
        ) : null}
    </>
  );
};

export { InsertImage };
