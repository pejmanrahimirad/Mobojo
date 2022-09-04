import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  FormGroup,
  Label,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScoringItems = (props) => {
  const [loading, setLoading] = useState(true);
  const [allSurvey, setAllSurvey] = useState([]);
  const { modal, toggle, categoryId } = props;
  useEffect(() => {
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query Query($categoryId: ID!) {
            getAllSurvey(categoryId: $categoryId) {
              _id
              name
              label
              category {
                _id
                name
              }
            }
          }`,
        variables: {
          categoryId: categoryId,
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        const { getAllSurvey } = res.data.data;
        setAllSurvey(getAllSurvey);
        setLoading(false);
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  }, []);

  return (
    <div className="animated fadeIn">
      <ToastContainer />
      <Card>
        <Modal isOpen={modal} toggle={toggle} className={"modal-lg "}>
          <ModalHeader toggle={toggle}>
            <Row></Row>
          </ModalHeader>
          <ModalBody>
            <div className="mediaSection">
              {loading ? (
                <Spinner />
              ) : (
                allSurvey.map((element) => {
                  return (
                    <Row key={element._id}>
                      <Col xs="5">
                        <FormGroup>
                          <Col md="3">
                            <Label>عنوان</Label>
                          </Col>
                          <Col md="9" xs="12">
                            <Input
                              type="text"
                              name="disabled-input"
                              placeholder={element.name}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs="5">
                        <Col md="3">
                          <Label>توضیحات</Label>
                        </Col>
                        <Col md="9" xs="12">
                            <Input
                              type="text"
                              name="disabled-input"
                              placeholder={element.label}
                            />
                          </Col>
                      </Col>
                    </Row>
                  );
                })
              )}
            </div>
          </ModalBody>
        </Modal>
      </Card>
    </div>
  );
};

export default ScoringItems;
