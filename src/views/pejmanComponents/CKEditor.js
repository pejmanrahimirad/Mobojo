import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {
    FormGroup,
    Col,
    Row,
    Label,
  } from "reactstrap";
const PejmanCKEditor = (props) => {
  return (
    <Row>
      <Col xl="12">
        <FormGroup>
          <Label for={"ckEditor"}>{props.title}</Label>
          <CKEditor
            editor={ClassicEditor}
            data={props.data}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => props.onChange(event, editor)}
            onBlur={(event, editor) => {
              console.log("Blur.", editor);
            }}
            onFocus={(event, editor) => {
              console.log("Focus.", editor);
            }}
          />
        </FormGroup>
      </Col>
    </Row>
  );
};

export {PejmanCKEditor}