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
import * as yup from "yup";
import axios from "axios";
import { cilLockLocked, cilUser } from "@coreui/icons";

const Login = () => {
  const validateSchema = yup.object().shape({
    email: yup
      .string()
      .min(11, "نام کاربری شما باید 11 کاراکتر باشد")
      .max(11, "نام کاربری شما باید 11 کاراکتر باشد")
      .required(),
    password: yup
      .string()
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
                    validateSchema={validateSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      axios({
                        url: "/",
                        method: "post",
                        data: JSON.stringify({
                          query: `query Query($phone: String!, $password: String!) {
                            login(phone: $phone, password: $password) {
                              status
                              message
                            }
                          }
                          `,
                          variables: {
                            phone: "09195888177",
                            password: "123456",
                          },
                        }),
                      }).then((res)=>{
                        console.log(res)
                      }).catch(err=>console.log(err))
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
                        <h2>پنل مدیریت فروشگاه</h2>
                        <p className="text-medium-emphasis">
                          به حساب کاربری خود وارد شوید
                        </p>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            name="email"
                            placeholder="Username"
                            autoComplete="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                          />
                        </CInputGroup>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                          />
                        </CInputGroup>

                        {errors.password && touched.password && errors.password}
                        <CRow>
                          <CCol xs={6}>
                            <CButton
                              color="primary"
                              className="px-4"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              ورود
                            </CButton>
                          </CCol>
                          <CCol xs={6} className="text-right">
                            <CButton color="link" className="px-0">
                              فراموش رمز عبور?
                            </CButton>
                          </CCol>
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
