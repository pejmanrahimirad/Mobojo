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
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
const Seller = (props) => {
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [categoryFromServer, setCategoryFromServer] = useState([]);
  const [categoryValue, setCategoryValue] = useState("");
  const [showSeller, setShowSeller] = useState([]);

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
            parent{
                name
            }
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
        const { getAllCategory } = res.data.data;
        const filteredArry = [];
        getAllCategory.filter((x) => {
          if (x.parent == null) {
            filteredArry.push(x);
         
          }
        });
        setCategoryFromServer(filteredArry);

        // toast.success("دسته بندی ها دریافت شد");
      } else {
        console.log(res.data)
        // toast.error(res.data.errors[0].message);
      }
    });
  }, []);

  const handleCategory = (event) => {
    setCategoryValue(event.target.value);
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query Query($categoryId: ID!) {
          getAllSeller(categoryId: $categoryId) {
            _id
            name
            label
          }
        }`,
        variables: {
          categoryId: event.target.value,
        },
      },
    }).then((res) => {
      console.log(res);
      if (res.data.data != null) {
        const { getAllSeller } = res.data.data;
        getAllSeller.map((item) => (item.flag = false));
        setShowSeller(getAllSeller);
      } else {
        setShowSeller([]);
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
        query: `mutation Seller($input: inputSeller) {
            seller(input: $input) {
              status
              message
            }
          }`,
        variables: {
          input: {
            name: title,
            category: categoryValue,
            label: label,
          },
        },
      },
    }).then((res) => {
      console.log(res);
      if (res.data.data != null) {
        toast.success("فروشنده اضافه شد");
        setTitle("");
        setLabel("");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  };

  const handleEdit = (item) => {
    item.flag = true;
    const newShowSeller = showSeller.filter((x) => x._id != item._id);
    setShowSeller([...newShowSeller, item]);
  };
  const editNameHandler = (event, item) => {
    item.name = event.target.value;
    const newShowSeller = showSeller.filter((x) => x._id != item._id);
    setShowSeller([...newShowSeller, item]);
  };
  const editLabelHandler = (event, item) => {
    item.label = event.target.value;
    const newShowSeller = showSeller.filter((x) => x._id != item._id);
    setShowSeller([...newShowSeller, item]);
  };
  const submitEdit = (item) => {
    axios({
      url: "/",
      method: "post",
      data: {
        query: `mutation UpdateSeller($input: updateSeller) {
          updateSeller(input: $input) {
            status
            message
          }
        }`,
        variables: {
          input: {
            id: item._id,
            name: item.name,
            label: item.label,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        toast.success("فروشنده ویرایش شد");
        item.flag = false;

        const newShowSeller = showSeller.filter((x) => x._id != item._id);
        setShowSeller([...newShowSeller, item]);
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
          <h6>اضافه کردن فروشنده </h6>
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
              <CTableHeaderCell scope="col">توضیحات</CTableHeaderCell>
              <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {showSeller != null && showSeller.length > 0
              ? showSeller.map((item) => {
                  return item.flag ? (
                    <CTableRow key={item._id}>
                      <CTableDataCell>
                        <Input
                          type="text"
                          value={item.name}
                          onChange={() => editNameHandler(event, item)}
                          placeholder="عنوان دسته بندی را وارد کنید"
                          required
                        />
                      </CTableDataCell>

                      <CTableDataCell>
                        <Input
                          type="text"
                          value={item.label}
                          onChange={() => editLabelHandler(event, item)}
                          placeholder="عنوان دسته بندی را وارد کنید"
                          required
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          type="submit"
                          onClick={() => submitEdit(item)}
                          size="sm"
                          color="success"
                        >
                          <CIcon icon={cilCheck} size="xl" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    <CTableRow key={item._id}>
                      <CTableDataCell>{item.name}</CTableDataCell>

                      <CTableDataCell>{item.label}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          type="submit"
                          onClick={() => handleEdit(item)}
                          size="sm"
                          color="primary"
                        >
                          <strong>ویرایش</strong>
                        </CButton>
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

export default Seller;
