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
    const [reload, setReload] = useState(false)
    const [orderStatus, setOrderStatus] = useState([])
    const [order, setOrder] = useState(null)
    let params = useParams()
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
                      products{
                        product{
                            _id
                            fname
                            original
                        }
                        attribute{
                            _id
                            price
                            discount
                            seller{
                                _id
                                name
                            }
                        }
                      }
                      user{
                        fname
                        lname
                        phone
                        address
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
                const { getAllOrderPayment } = res.data.data;
                setOrder(getAllOrderPayment[0])
            }
        })

        axios({
            url: '/',
            method: 'POST',
            data: {
                query: `query AllOrderStatus {
                AllOrderStatus {
                    _id
                  count
                  default
                  order
                  image
                }
              }`}
        }).then((res) => {
            if (res.data.data != null) {

                const { AllOrderStatus } = res.data.data;
                console.log(AllOrderStatus)
                setOrderStatus(AllOrderStatus)
            }
        })
    }, [reload])

    return (
        <div className="animated fadeIn">
            <ToastContainer />
            {(order != null) ?
                <>
                    <Card>
                        <CardHeader>

                            <h3> <CIcon
                                icon={cilHamburgerMenu}
                                size="lg"
                            /> سفارش  {order._id}</h3>
                            <h6>ثبت شده در تاریخ:{new Date(order.createdAt).toLocaleDateString('fa-IR')}</h6>
                        </CardHeader>
                        <CardBody className="cardBody">
                            <Row>
                                <Col>
                                    تحویل گیرنده : {order.user.fname} {order.user.lname}
                                </Col>
                                <Col>
                                    شماره تماس تحویل گیرنده : {order.user.phone}
                                </Col>
                            </Row>
                        </CardBody>
                        <CardBody className="cardBody">
                            <Row>
                                <Col>
                                    آدرس تحویل گیرنده : {order.user.address}
                                </Col>
                                <Col>
                                    تعداد محصولات مرسوله : {order.count}
                                </Col>
                            </Row>
                        </CardBody>
                        <CardBody className="cardBody">
                            <Row>
                                <Col>
                                    مبلغ کل : {Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR' }).format(order.price)}
                                </Col>
                                <Col>
                                    مبلغ قابل پرداخت : 0
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>

                            <h6>وضعیت : {order.orderStatus.name}</h6>
                        </CardHeader>
                        <CardBody className="cardBody">
                            <Row>
                                {
                                    orderStatus.map((item, index) => {
                                        return (<Col key={index} className={'statusOrder'}>
                                            <img
                                                src={`${process.env.REACT_APP_PUBLIC_URL}${item.image}`}
                                                className={`statusImage ${(order.orderStatus._id == item._id) ? 'isActive' : null}`}
                                                alt={item.name} />
                                            <span style={(order.orderStatus._id == item._id) ? { color: '#000' } : null}>
                                                {item.order}
                                            </span>
                                        </Col>)
                                    })
                                }
                            </Row>
                        </CardBody>
                        <CardBody className="cardBody">
                            <Row>
                                <Col>کد مرسوله : {order._id.substr(18, 24)}</Col>
                                <Col>زمان تحویل : زمانی مشخص نشده است</Col>
                            </Row>
                        </CardBody>
                        <CardBody className="cardBody">
                            <Row>
                                <Col>نحوه ارسال مرسوله : پست پیشتز با ظرفیت اختصاصی برای </Col>
                                <Col>هزینه ارسال : رایگان</Col>
                            </Row>
                        </CardBody>
                        <CardBody>


                            <CTable>
                                <CTableHead color="dark">
                                    <CTableRow>
                                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                                        <CTableHeaderCell scope="col">نام محصول</CTableHeaderCell>
                                        <CTableHeaderCell scope="col"> تعداد</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">قیمت واحد</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">قیمت کل</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">تخفیف</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">قیمت نهایی</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {order.products.map((product, index) => {
                                        const item = product.product
                                        const attr=product.attribute
                                        return (
                                            <CTableRow key={index}>
                                                <CTableDataCell className={'preview'}>
                                                    <img src={`${process.env.REACT_APP_PUBLIC_URL}${item.original}`}
                                                        alt={item.fname} />
                                                </CTableDataCell>
                                                <CTableDataCell >
                                                    {item.fname}
                                                    فروشنده: {attr.seller.name}
                                                </CTableDataCell>
                                                <CTableDataCell >{order.count}</CTableDataCell>
                                                <CTableDataCell >{attr.price}</CTableDataCell>
                                                <CTableDataCell >{order.count*attr.price}</CTableDataCell>
                                                <CTableDataCell >{attr.price*attr.discount}</CTableDataCell>
                                                <CTableDataCell >باید سبدخرید طراحی گردد</CTableDataCell>
                                            </CTableRow>
                                        )
                                    })}
                                </CTableBody>
                            </CTable>

                        </CardBody>
                    </Card>
                </>

                : null}
        </div>
    );
};

export default OrderDetails;
