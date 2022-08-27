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
import { cilTrash } from "@coreui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Library from "../media/Library";
import { DocsExample } from "src/components";
const Category = (props) => {
  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [mainSubTitle, setMainSubTitle] = useState(null);
  const [subTitle, setSubTitle] = useState(null);
  const [mainCategory, setMainCategory] = useState(false);
  const [parentCategory, setParentCategory] = useState(false);
  const [catId, setCatId] = useState(null);
  const [mainSubTitleFromServer, setMainSubTitleFromServer] = useState([]);
  const [subTitleFromServer, setSubtitleFromServer] = useState([]);
  const [status, ChangeStatus] = useState(false);
  const [result, setResult] = useState([]);
  const toggle = () => setModal(!modal);
  const selectImage = () => {
    setModal(true);
  };

  const addImage = (item) => {
    console.log(item);
    setImage(item);
    setModal(false);
  };
  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleLabel = (event) => {
    setLabel(event.target.value);
  };
  const handleMainSubtitle = (event) => {
    setMainSubTitle(event.target.value);
    setMainCategory(false);
    setParentCategory(true);
    setCatId(event.target.value);
    ChangeStatus(!status);
  };
  const handleSubtitle = (event) => {
    setSubTitle(event.target.value);
    console.log(event.target.value);
  };
  const submitForm = () => {
    let parent = null;
    if (mainSubTitle !== "" && subTitle === "") {
      parent = mainSubTitle;
    }
    if (mainSubTitle !== "" && subTitle !== "") {
      parent = subTitle;
    }
    axios({
      url: "/",
      method: "post",
      data: {
        query: `mutation Category($input: InputCategory) {
          category(input: $input) {
            status
            message
          }
        }`,
        variables: {
          input: {
            name: title,
            label: label,
            parent: parent,
            image: image._id,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        toast.success("با موفقیت ذخیره شد");
        setMainSubTitleFromServer([]);
        setSubtitleFromServer([]);
      } else {
        setMainSubTitleFromServer([]);
        setSubtitleFromServer([]);
        toast.error(res.data.errors[0].message);
      }
    });
  };

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
            mainCategory: false,
            parentCategory: false,
            catId: null,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        console.log(res);
        const { getAllCategory } = res.data.data;
        setResult(getAllCategory);
      }
      else{
        alert('hi')
      }
    });
  }, []);
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
            mainCategory: mainCategory,
            parentCategory: parentCategory,
            catId: catId,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        console.log(res);
        const { getAllCategory } = res.data.data;
        if (mainCategory) {
          setMainSubTitleFromServer(getAllCategory);
        }
        if (parentCategory) {
          setSubtitleFromServer(getAllCategory);
        }
        toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  }, [status]);
  const titleOnBlur = () => {
    setMainCategory(true);
    ChangeStatus(!status);
  };
  return (
    <div className="animated fadeIn">
      <ToastContainer />
      <Card>
        <CardHeader>
          <h6>اضافه کردن دسته بندی</h6>
        </CardHeader>
        <CardBody>
          <FormGroup row className="my-0">
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
                  onBlur={titleOnBlur}
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
            <Col xs="3">
              <FormGroup>
                <label htmlFor="mainSubTitle">دسته اصلی</label>
                <Input
                  type="select"
                  name="mainSubTitle"
                  id="mainSubTitle"
                  onChange={handleMainSubtitle}
                >
                  <option>یک دسته بندی را انتخاب کنید</option>
                  {mainSubTitleFromServer.map((item) => {
                    return (
                      <option value={item._id} key={item._id}>
                        {item.name}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
            </Col>
            <Col xs="3">
              <FormGroup>
                <label htmlFor="SubTitle">دسته دوم</label>
                <Input
                  type="select"
                  name="SubTitle"
                  id="SubTitle"
                  onChange={handleSubtitle}
                >
                  <option>یک دسته بندی را انتخاب کنید</option>
                  {subTitleFromServer.map((item) => {
                    return (
                      <option value={item._id} key={item._id}>
                        {item.name}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
            </Col>
            <Col xs="6" style={{ margin: 5 }}>
              <CButton
                type="submit"
                size="sm"
                color="primary"
                onClick={selectImage}
              >
                <strong>انتخاب تصویر</strong>
              </CButton>
              {image != null ? (
                <div style={{ position: "relative" }}>
                  <span
                    onClick={() => setImage(null)}
                    style={{
                      position: "absolute",
                      color: "white",
                      background: "red",
                      borderRadius: 5,
                      padding: 5,
                      top: 15,
                      right: 15,
                      lineHeight: 0.8,
                      cursor: "pointer",
                    }}
                  >
                    x
                  </span>
                  <img
                    src={`${process.env.REACT_APP_PUBLIC_URL}${image.dir}`}
                    alt={image.name}
                    style={{
                      height: "200px",
                      width: "200px",
                      borderRadius: 5,
                      margin: 10,
                    }}
                  />
                </div>
              ) : null}
            </Col>
          </FormGroup>
        </CardBody>
        <CardFooter className="footer">
          <CRow>
            <CButton type="submit" color="primary" onClick={submitForm}>
              <strong>ثبت</strong>
            </CButton>
          </CRow>
        </CardFooter>
      </Card>
      {modal ? (
        <Library
          modal={modal}
          setModal={setModal}
          addImage={addImage}
          toggleLarge={toggle}
        />
      ) : null}

      <CCol xs={12}>
        <hr />
        <CTable>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">عنوان</CTableHeaderCell>
              <CTableHeaderCell scope="col">نوع دسته بندی</CTableHeaderCell>
              <CTableHeaderCell scope="col">پدر</CTableHeaderCell>
              <CTableHeaderCell scope="col">تصویر</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {result.map((item) => {
              return (
                <CTableRow key={item._id}>
                  <CTableDataCell >{item.name}</CTableDataCell>
                  <CTableDataCell colSpan="2">{item.parent?item.parent.name:<strong style={{background:'blue',borderRadius:5,padding:5,color:'white'}}>دسته اصلی</strong>}</CTableDataCell>
                  <CTableDataCell>
                    <img
                      src={`${process.env.REACT_APP_PUBLIC_URL}${item.image.dir}`}
                      alt={item.name}
                      style={{ height: "64px", width: "64px" }}
                    />
                  </CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
      </CCol>
    </div>
  );
};

export default Category;
