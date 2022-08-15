import React from "react";
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { cilLockLocked, cilUser } from "@coreui/icons";

const Login = () => {
  const validateSchema = Yup.object().shape({
    email: Yup.string()
      .min(11, "نام کاربری شما باید 11 کاراکتر باشد")
      .max(11, "نام کاربری شما باید 11 کاراکتر باشد")
      .required(),
    password: Yup.string()
      .min(6, "رمزعبور شما باید بیشتراز 6 کاراکتر باشد")
      .max(30, "رمز شما نبایدبیشتر از 30 کاراکتر باشد")
      .required(),
  });
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validateSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                      }, 400);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      /* and other goodies */
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            type="string"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                          />
                        </CInputGroup>
                        <div style={{ margin: 15, color: "red" }}>
                          {errors.email && touched.email && errors.email}
                        </div>

                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                          />
                        </CInputGroup>
                        <div style={{ margin: 15, color: "red" }}>
                          {errors.password &&
                            touched.password &&
                            errors.password}
                        </div>
                        <CRow>
                          <CButton
                            type="submit"
                            color="primary"
                            className="px-4"
                            disabled={isSubmitting}
                          >
                            Submit
                          </CButton>
                        </CRow>
                      </form>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white bg-primary py-5"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>ثبت نام</h2>
                    <hr />
                    <p>ثبت نام در فروشگاه.</p>
                    <Link to="/register">
                      <CButton
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        ثبت نام!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
