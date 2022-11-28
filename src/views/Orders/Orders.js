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
    Spinner,
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

import CIcon from "@coreui/icons-react";
import { cilAlignCenter, cilAlignRight, cilHamburgerMenu } from "@coreui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangeStatus from "./ChangeStatus";
import "./style.css";
import axios from "axios";

import GetToken from "src/context/auth/GetToken";
import history from "src/context/auth/history";
import OrderRow from "./OrderRow";
const Status = (props) => {
    const [allPayment, setAllPayment] = useState([])
    const [reload, setReload] = useState(false)
    const [modal, setModal] = useState(false)
    const [orderId, setOrderId] = useState(null)
    const [status, setStatus] = useState({})
    useEffect(() => {
        axios({
            url: '/',
            method: 'POST',
            data: {
                query: `query Query($orderId: ID) {
                    getAllOrderPayment(orderId: $orderId) {
                        _id
                        createdAt
                      count
                      discount
                      orderStatus {
                        _id
                        name
                      }
                      price
                      user{
                        fname
                        lname
                      }
                      success
                    }
                  }`,
                variables: {
                    "orderId": null
                }
            }
        }).then((res) => {
            if (res.data.data != null) {
                const { getAllOrderPayment } = res.data.data;
                setAllPayment(getAllOrderPayment)
            }
        })
    }, [reload])

    const toggleLarge = (orderId) => {
        setModal(!modal)
        setOrderId(orderId)
        console.log(orderId)
    }
    const updateStatus = () => {
        axios({
            url: '/',
            method: 'POST',
            data: {
                query: `mutation UpdatePaymentStatus($input: InputUpdatePaymentStatus) {
                    updatePaymentStatus(input: $input) {
                      message
                      status
                    }
                  }`,
                variables: {
                    "input": {
                        "orderStatusID": status.id,
                        "paymentId": orderId
                    }
                }
            }

        }).then((res) => {
            if (res.data.data != null) {
                const { updatePaymentStatus } = res.data.data;
               console.log(updatePaymentStatus)
               setModal(false)
               setReload(!reload)
            }
        })
    }
    return (
        <div className="animated fadeIn">
            <ToastContainer />
            <Card>
                <CardHeader>
                    <CIcon
                        icon={cilHamburgerMenu}
                        size="lg"
                    />
                    <span>لیست سفارش ها</span>
                </CardHeader>
                <CardBody>


                    <CTable>
                        <CTableHead color="dark">
                            <CTableRow>
                                <CTableHeaderCell scope="col">شماره سفارش</CTableHeaderCell>
                                <CTableHeaderCell scope="col">نام کاربر</CTableHeaderCell>
                                <CTableHeaderCell scope="col"> وضعیت سفارش</CTableHeaderCell>
                                <CTableHeaderCell scope="col">تاریخ سفارش</CTableHeaderCell>
                                <CTableHeaderCell scope="col">مبلغ کل</CTableHeaderCell>
                                <CTableHeaderCell scope="col">عملیات پرداخت</CTableHeaderCell>
                                <CTableHeaderCell scope="col">جزئیات</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {(allPayment.length > 0) ?

                                allPayment.map((item,index) => {
                                    return (
                                        <OrderRow key={index} item={item} toggleLarge={toggleLarge} />
                                    )
                                })
                                :
                                <center>
                                    <Spinner />
                                </center>
                            }
                        </CTableBody>
                    </CTable>

                </CardBody>

            </Card>
            {
                modal ?
                    <ChangeStatus modal={modal}
                        toggleLarge={toggleLarge}
                        setStatus={setStatus}
                        updateStatus={updateStatus}
                    />
                    : null
            }

        </div>
    );
};

export default Status;
