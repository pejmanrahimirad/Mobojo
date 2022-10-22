import React from "react";

import { FormGroup, Col, Row, Label, Input } from "reactstrap";
import "../style.css";
const InsertImage = (props) => {
    const {image}=props;
  return (
    <>
      <Col xs="3">
        <FormGroup row>
          <label htmlFor="file-multiple-input" className="file-dashed">
            <div className="fileSelection">گزینش پرونده</div>
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
      {image ? (
        <Col xs="9" className="showImage">
          <img src={image} alt={image} className="previewImage" />
        </Col>
      ) : null}
    </>
  );
};

export { InsertImage };
