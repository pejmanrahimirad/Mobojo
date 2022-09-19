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
const Warranty = (props) => {
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [allWarranty, setAllWarranty] = useState([]);
  useEffect(() => {
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query Query {
            getAllWarranty {
              _id
              name
              label
            }
          }`,
      },
    }).then((res) => {
      if (res.data.data != null) {
        const { getAllWarranty } = res.data.data;
        setAllWarranty(getAllWarranty);
        // toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  }, []);

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
        query: `mutation Warranty($input: InputWarranty) {
            warranty(input: $input) {
              status
              message
            }
          }`,
        variables: {
          input: {
            name: title,
            label: label,
          },
        },
      },
    }).then((res) => {
      console.log(res);
      if (res.data.data != null) {
        toast.success("گارانتی اضافه شد");
        setTitle("");
        setLabel("");
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
          <h6>اضافه کردن گارانتی </h6>
        </CardHeader>
        <CardBody>
          <FormGroup row className="my-0">
            <Col xs="3">
              <FormGroup>
                <label htmlFor="title">نام گارانتی</label>
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
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {allWarranty != undefined
              ? allWarranty.map((item) => {
                  return (
                    <CTableRow key={item._id}>
                      <CTableDataCell>{item.name}</CTableDataCell>
                      <CTableDataCell>{item.label}</CTableDataCell>
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

export default Warranty;
