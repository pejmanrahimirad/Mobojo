import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Progress,
  Col,
  Row,
  Label,
} from "reactstrap";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import axios from "axios";
import CIcon from "@coreui/icons-react";

import { cibAddthis } from "@coreui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScoringItems from "./ScoringItems";
import "./style.css";
const Scoring = (props) => {
  const [categoryFromServer, setCategoryFromServer] = useState([]);
  const [categoryValue, setCategoryValue] = useState("");
  const [subCategoryFromServer, setSubCategoryFromServer] = useState([]);
  const [ID, setID] = useState(null);
  const [ownerState, setOwnerState] = useState([]);
  const [showCategory, setShowCategory] = useState([]);
  const [categorySelected, setCategorySelected] = useState("");
  const [modal, setModal] = useState(false);
  const [subCatId, setSubCatId] = useState(null);
  useEffect(() => {
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query Query($input: InputgetCategory) {
        getAllCategory(input: $input) {
          _id
          name
          label
          parent {
            _id
            name
          }
          image {
            _id
            dir
            name
          }
        }
      }`,
        variables: {
          input: {
            page: 1,
            limit: 30,
            mainCategory: true,
            parentCategory: false,
            catId: null,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        const { getAllCategory } = res.data.data;
        setCategoryFromServer(getAllCategory);

        // toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  });

  const handleCategory = (event) => {
    setCategoryValue(event.target.value);
    setCategorySelected(event.target.value);

    axios({
      url: "/",
      method: "post",
      data: {
        query: `query Query($input: InputgetCategory) {
        getAllCategory(input: $input) {
          _id
          name
          label
          parent {
            _id
            name
          }
          image {
            _id
            dir
            name
          }
        }
      }`,
        variables: {
          input: {
            page: 1,
            limit: 30,
            mainCategory: false,
            parentCategory: true,
            catId: event.target.value,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        const { getAllCategory } = res.data.data;
        setSubCategoryFromServer(getAllCategory);

        setShowCategory(getAllCategory);
        // toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  };

  const addField = (event) => {
    const newState = [...ownerState];
    newState.push({
      name: "",
      label: "",
    });
    setOwnerState(newState);
  };
  const getID = (event) => {
    setID(event.target.value);
  };
  const handleChange = (event, id, operation) => {
    const field = { ...ownerState[id] };
    switch (operation) {
      case "name":
        {
          field.name = event.target.value;
          const newOwnerState = [...ownerState];
          newOwnerState[id] = field;
          setOwnerState(newOwnerState);
          console.log(field);
        }
        break;
      case "label":
        {
          field.label = event.target.value;
          const newOwnerState = [...ownerState];
          newOwnerState[id] = field;
          setOwnerState(newOwnerState);
          console.log(field);
        }
        break;
      default:
        return;
    }
  };
  const handleSubmit = () => {
    if (ownerState.length == 0) {
      toast.error("یک مورد را وارد کنید");
      return false;
    }

    ownerState.forEach((x) => {
      x.category = ID;
    });

    axios({
      url: "/",
      method: "post",
      data: {
        query: `mutation Mutation($input: InputSurvey) {
          survey(input: $input) {
            status
            message
          }
        }`,
        variables: {
          input: {
            list: ownerState,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        console.log(res);
        // const { getAllCategory } = res.data.data;
        // setSubCategoryFromServer(getAllCategory);
        setOwnerState([]);
        toast.success("مشخصه های امتیاز دهی اضافه شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  };

  const getIdsubCategory = (event) => {
 
  };
  const toggle = () => setModal(!modal);

  const showModal = (id) => {
    setSubCatId(id);
    setModal(true);
  };
  return (
    <div className="animated fadeIn">
      <ToastContainer />
      <Card>
        <CardHeader>
          <h6>اضافه کردن مشخصات امتیاز دهی</h6>
        </CardHeader>
        <CardBody>
          <FormGroup row className="my-0">
            <Col xs="4">
              <label htmlFor="mainSubTitle">دسته اصلی</label>
              <Input
                type="select"
                name="mainSubTitle"
                value={categoryValue}
                onChange={handleCategory}
                id="mainSubTitle"
              >
                <option>یک دسته بندی را انتخاب کنید</option>
                {categoryFromServer.map((item) => {
                  return (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </Input>
            </Col>
            <Col xs="4">
              <label htmlFor="mainSubTitle">دسته دوم</label>
              <Input
                type="select"
                name="mainSubTitle"
                id="mainSubTitle"
                // value={subCategoryFromServer}
                onChange={getID}
              >
                <option></option>
                {subCategoryFromServer.map((item) => {
                  return (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </Input>
            </Col>

            <Col xs="2" className="addButton">
              <br />
              <CIcon
                icon={cibAddthis}
                color="success"
                size="xxl"
                onClick={addField}
              />
            </Col>
          </FormGroup>
          <FormGroup row className="my-0">
            {ownerState.map((item, index) => {
              const scoreId = `name-${index}`;
              const labelId = `label-${index}`;
              return (
                <>
                  <Col xs="5">
                    <FormGroup>
                      <Label htmlFor={scoreId}>عنوان</Label>
                      <Input
                        type="text"
                        id={scoreId}
                        name={scoreId}
                        placeholder="عنوان را وارد کنید"
                        value={item.name}
                        onChange={(event) => handleChange(event, index, "name")}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="5">
                    <FormGroup>
                      <Label htmlFor={labelId}>توضیحات</Label>
                      <Input
                        type="text"
                        id={labelId}
                        name={labelId}
                        placeholder="توضیحات را وارد کنید"
                        value={item.label}
                        onChange={(event) =>
                          handleChange(event, index, "label")
                        }
                        required
                      />
                    </FormGroup>
                  </Col>
                </>
              );
            })}
          </FormGroup>
        </CardBody>
        <CardFooter className="footer">
          <CRow>
            <CButton type="submit" color="primary" onClick={handleSubmit}>
              <strong>ثبت</strong>
            </CButton>
          </CRow>
        </CardFooter>
      </Card>

      <CCol xs={12}>
   
        <hr />
        <CTable>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">نام دسته</CTableHeaderCell>
              <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {showCategory.length > 0
              ? showCategory.map((item) => {
                  return (
                    <CTableRow key={item._id}>
                      <CTableDataCell>{item.name}</CTableDataCell>

                      <CTableDataCell>
                        <span
                          className="showSurvey"
                          onClick={() => showModal(item._id)}
                        >
                          مشاهده معیارهای امتیازدهی
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              : null}
          </CTableBody>
        </CTable>
      </CCol>
      {modal ? (
        <ScoringItems modal={modal} toggle={toggle} categoryId={subCatId} />
      ) : null}
    </div>
  );
};

export default Scoring;
