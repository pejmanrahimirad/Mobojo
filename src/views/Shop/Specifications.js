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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
const Specifications = (props) => {
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [categoryFromServer, setCategoryFromServer] = useState([]);
  const [categoryValue, setCategoryValue] = useState("");
  const [subCategoryFromServer, setSubCategoryFromServer] = useState([]);
  const [allProductSpecs,setAllProductSpecs]=useState([])
  const [ID, setID] = useState(null);
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

        // toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  };

  const getID = (event) => {
    setID(event.target.value);
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query Query($categoryId: ID!) {
          getAllProductSpecs(categoryId: $categoryId) {
            _id
            specs
            label
            category {
              _id
              name
            }
            details {
              _id
              name
              specs {
                specs
              }
              label
            }
          }
        }`,
        variables: {
          categoryId: event.target.value,
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        const {getAllProductSpecs}=res.data.data;
        setAllProductSpecs(getAllProductSpecs);
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  };
  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleLabel = (event) => {
    setLabel(event.target.value);
  };

  const handleSubmit = () => {
    axios({
      url: "/",
      method: "post",
      data: {
        query: `mutation Mutation($input: InputProductSpecs) {
          productSpecs(input: $input) {

            status
            message
          }
        }`,
        variables: {
          input: {
            category: ID,
            specs: title,
            label: label,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        console.log(res);
        toast.success("مشخصه های امتیاز دهی اضافه شد");
        setAllProductSpecs([...allProductSpecs,{specs:title,label:label}])
        setTitle('')
        setLabel('')
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  };

  return (
    <div className="animated fadeIn">
      <ToastContainer />
      <Card>
        <CardHeader>
          <h6>اضافه کردن مشخصات </h6>
        </CardHeader>
        <CardBody>
          <FormGroup row className="my-0">
            <Col xs="3">
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
            <Col xs="3">
              <label htmlFor="mainSubTitle">دسته دوم</label>
              <Input
                type="select"
                name="mainSubTitle"
                id="mainSubTitle"
                // value={subCategoryFromServer}
                onChange={getID}
              >
                <option>یک دسته بندی را انتخاب کنید</option>
                {subCategoryFromServer.map((item) => {
                  return (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </Input>
            </Col>
            <Col xs="3">
              <FormGroup>
                <label htmlFor="title">عنوان</label>
                <Input
                  type="text"
                  value={title}
                  onChange={handleTitle}
                  id="title"
                  placeholder="عنوان دسته بندی را وارد کنید"
                  required
                />
              </FormGroup>
            </Col>
            <Col xs="3">
              <FormGroup>
                <label htmlFor="label">توضیحات</label>
                <Input
                  type="text"
                  value={label}
                  onChange={handleLabel}
                  id="label"
                  placeholder="توضیحات دسته بندی را وارد کنید"
                />
              </FormGroup>
            </Col>
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
              <CTableHeaderCell scope="col">عنوان</CTableHeaderCell>
              <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {(allProductSpecs!=null&& allProductSpecs.length> 0) 
              ? allProductSpecs.map((item) => {
                  return (
                    <CTableRow key={item._id}>
                      <CTableDataCell>{item.specs}</CTableDataCell>

                      <CTableDataCell>
                      {item.label}
                        {/* <span
                          className="showSurvey"
                          onClick={() => showModal(item._id)}
                        >
                          مشاهده معیارهای امتیازدهی
                        </span> */}
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              : null}
          </CTableBody>
        </CTable>
      </CCol>
    </div>
  );
};

export default Specifications;
