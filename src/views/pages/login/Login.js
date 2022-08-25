import React, { useState, useContext } from "react";
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
import { Spinner } from "reactstrap";
import CIcon from "@coreui/icons-react";
import { Formik } from "formik";
import * as Yup from "yup";
import Recaptcha from "react-recaptcha";
import axios from "axios";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { AuthContext } from "src/context/auth/authContext";
import history from "src/context/auth/history";
const validateSchema = Yup.object().shape({
  email: Yup.string()
    .min(11, "نام کاربری شما باید 11 کاراکتر باشد")
    .max(11, "نام کاربری شما باید 11 کاراکتر باشد")
    .required("این فیلد ضروری است"),
  password: Yup.string()
    .min(6, "رمزعبور شما باید بیشتراز 6 کاراکتر باشد")
    .max(30, "رمز شما نبایدبیشتر از 30 کاراکتر باشد")
    .required("این فیلد ضروری است"),
});
const Login = (props) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const [isVerified, setIsVersified] = useState(false);
  const verifyCallback = (response) => {
    if (response) {
      setIsVersified(true);
    }
  };
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
                    onSubmit={async (values, { setSubmitting }) => {
                      setLoading(true);
                      if (isVerified) {
                        setMessage("لطفا تیک من ربات نیستم را بزنید");
                        setSubmitting(false);
                        return;
                      }
                      setMessage("");
                      await axios({
                        url: "/",
                        method: "POST",
                        data: {
                          query: `query Query($phone: String!, $password: String!) {
                            login(phone: $phone, password: $password) {
                              status
                              message
                              token
                            }
                          }`,
                          variables: {
                            phone: values.email,
                            password: values.password,
                          },
                        },
                      })
                        .then((res) => {
                          setLoading(false);
                          if (res.data != null && res.data.data != null) {
                            // const {message}=res.data.data.message
                            const { token } = res.data.data.login;
                            dispatch({ type: "login", payload: token });
                            setSubmitting(false);
                            history.replace('/dashboard',{some:'state'})
                            history.go()
                          } else {
                            console.log(res.data.errors[0]);
                            const { message } = res.data.errors[0];
                            setMessage(message);
                          }
                        })
                        .catch((err) => console.log(err));

                      setSubmitting(false);
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
                        <div style={{ margin: 15, color: "red" }}>
                          {message}
                        </div>
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
                        <CInputGroup className="mb-4">
                          <Recaptcha
                            sitekey="6LePigkUAAAAAAW7k_bmOr_Pijn-WzbjTfaFV8JD"
                            render="explicit"
                            verifyCallback={verifyCallback}
                            hl="fa"
                          />
                        </CInputGroup>
                        <CRow>
                          <CButton
                            type="submit"
                            color="primary"
                            className="px-4"
                            disabled={isSubmitting}
                          >
                            {loading ? <Spinner /> : "Submit"}
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
