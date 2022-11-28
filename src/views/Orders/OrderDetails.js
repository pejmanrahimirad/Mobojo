import React, { useContext, useEffect, useState } from "react";

import { useParams } from 'react-router-dom'
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
import "./style.css";
import axios from "axios";

const OrderDetails = (props) => {
    const [reload,setReload]=useState(false)
    const [order,setOrder]=useState(null)
    let params=useParams()
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
                    "orderId": params.orderid
                }
            }
        }).then((res) => {
            console.log(res)
            if (res.data.data != null) {
                const {getAllOrderPayment}=res.data.data;
                setOrder(getAllOrderPayment[0])
            }
        })
    }, [reload])

    return (
        <div className="animated fadeIn">
            <ToastContainer />
            <Card>
                <CardHeader>
                    <CIcon
                        icon={cilHamburgerMenu}
                        size="lg"
                    />
                    {(order!=null)?<span> سفارش  {order._id}</span>:null}
                </CardHeader>
                <CardBody>
                </CardBody>
            </Card>
        </div>
    );
};

export default OrderDetails;
 