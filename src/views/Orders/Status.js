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
import "./style.css";
import axios from "axios";

import GetToken from "src/context/auth/GetToken";
import history from "src/context/auth/history";
const Status = (props) => {
    const [title, setTitle] = useState('')
    const [checked, setChecked] = useState(false)
    const [file, setFile] = useState('')
    const [image, setImage] = useState('')
    const [orderStatus, setOrderStatus] = useState([])
    const [reload,setReload]=useState(false)
    useEffect(() => {
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
                AllOrderStatus.map((item) => {
                    item.flag = false;
                })
                setOrderStatus(AllOrderStatus)
            }
        })
    }, [reload])

    const handleTitle = (event) => {
        setTitle(event.target.value)

    }
    const setDefault = () => {
        setChecked(!checked)
    }
    const handleFile = (event) => {
        const eventFile = event.target.files[0]
        setFile(eventFile)
        const preview = URL.createObjectURL(eventFile)
        setImage(preview)
    }
    const handleSubmit = () => {
        if (title == '') {
            toast.error('لطفا عنوان وضعیت را وارد کنید')
            return;
        }
        if (file == '') {
            toast.error('لطفا یک تصویر انتخاب کنید')
            return;
        }
        let data = {
            query: `mutation Mutation($name: String!, $image: Upload, $default: Boolean) {
                orderStatus(name: $name, image: $image, default: $default) {
                  message
                  status
                }
              }
            `,
            variables: {
                "name": title,
                "image": null,
                "default": checked
            }
        };

        let map = {
            0: ["variables.image"],
        };
        const FormD = new FormData();
        FormD.append("operations", JSON.stringify(data));
        FormD.append("map", JSON.stringify(map));
        FormD.append(0, file, file.name);
        axios({
            url: "/",
            method: "post",
            data: FormD
        }).then((res) => {
            if (res.data.data != null) {
                toast.success("وضعیت سفارش با موفقیت ثبت شد");
                setReload(!reload)
                setTitle('')
                setFile('')
                setImage('')
                setChecked(false)
                // history.replace('/orders', { some: 'state' })
                // history.go()
            } else {
                console.log(res)
                toast.error("خطا در ثبت " + res.data.errors[0].message);
            }
        })
            .catch((err) => console.log(err));
    }

    const handleEdit = (id) => {
        const temp = [...orderStatus]

        const index = temp.findIndex(item => {
            return item._id === id
        })
        temp[index].flag = true
        setOrderStatus(temp)
    }

    const changeNameHandler = (event, id) => {
        const temp = [...orderStatus]

        const index = temp.findIndex(item => {
            return item._id === id
        })
        temp[index].order = event.target.value
        setOrderStatus(temp)
    }
    const changeDefaultHandler = (event, id) => {
        const temp = [...orderStatus]

        const index = temp.findIndex(item => {
            return item._id === id
        })
        temp[index].default = !temp[index].default
        setOrderStatus(temp)
    }
    const submitEdit = (id) => {
        const temp = [...orderStatus]

        const index = temp.findIndex(item => {
            return item._id === id
        })
        console.log(temp[index])
        axios({
            url: '/',
            method: 'POST',
            data: {
                query: `mutation Mutation($updateStatusId: ID!, $name: String!, $default: Boolean!) {
                    updateStatus(id: $updateStatusId, name: $name, default: $default) {
                      message
                      status
                    }
                  }`,
                variables: {
                    "updateStatusId": id,
                    "name": temp[index].order,
                    "default": temp[index].default
                }
            }
        }).then((res) => {
            console.log(res)
            if (res.data.data != null) {
                toast.success('با موفقیت ویرایش شد')
                temp[index].flag=false
                setOrderStatus(temp)
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
                    <span>اضافه کردن وضعیت سفارش ها</span>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col lg="4">
                            <Label htmlFor="title">عنوان</Label>
                            <Input
                                type={"text"}
                                required
                                id={"title"}
                                value={title}
                                onChange={handleTitle}
                                placeholder=" عنوان وضعیت سفارش"
                            />
                        </Col>
                        <Col lg="4" className="checkBox">
                            <Label htmlFor="default"> تعیین به عنوان حالت پیشفرض سفارش</Label>
                            <Input
                                id={"default"}
                                type={'checkbox'}
                                value={checked}
                                onChange={setDefault}
                            ></Input>
                        </Col>
                        <Col lg="4">
                            <Label htmlFor="file" className="fileSelection">
                                <div >انتخاب عکس</div>
                            </Label>
                            <Input
                                type={"file"}
                                id={'file'}
                                name="file"
                                onChange={handleFile}
                                placeholder=" عنوان وضعیت سفارش"
                            />
                        </Col>
                    </Row>
                    <Row className={'preview'}>
                        {(image != '') ?
                            <img src={image} alt={image} />
                            : null}
                    </Row>
                </CardBody>
                <CardFooter>
                    <CButton type="submit"
                        size="sm"
                        color="primary"
                        onClick={handleSubmit}>
                        ثبت
                    </CButton>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    لیست وضعیت سفارش ها
                </CardHeader>
                <CardBody>


                    <CTable>
                        <CTableHead color="dark">
                            <CTableRow>
                                <CTableHeaderCell scope="col">عنوان</CTableHeaderCell>
                                <CTableHeaderCell scope="col">عکس</CTableHeaderCell>
                                <CTableHeaderCell scope="col">وضعیت</CTableHeaderCell>
                                <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {(orderStatus.length > 1) ?

                                orderStatus.map((item,index) => {
                                    return (
                                        <CTableRow key={index} >
                                            <CTableDataCell>
                                                {item.flag ?
                                                    <Input type="text"
                                                        value={item.order}
                                                        onChange={(event) => changeNameHandler(event, item._id)} />
                                                    :
                                                    item.order
                                                }
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <img src={`${process.env.REACT_APP_PUBLIC_URL}${item.image}`}
                                                    alt={item.order}
                                                    className={'showImageList'}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>{item.flag ?

                                                <Input type="checkbox"
                                                    value={item.default}
                                                    onChange={(event) => changeDefaultHandler(event, item._id)} />
                                                : (item.default) ? "پیشفرض" : "عادی"
                                            }</CTableDataCell>
                                            <CTableDataCell>
                                                {item.flag ?
                                                    <CButton type="submit"
                                                        size="sm"
                                                        color="success"
                                                        onClick={() => submitEdit(item._id)}>
                                                        ثبت
                                                    </CButton>
                                                    :
                                                    <CButton type="submit"
                                                        size="sm"
                                                        color="primary"
                                                        onClick={() => handleEdit(item._id)}>
                                                        ویرایش
                                                    </CButton>
                                                }
                                            </CTableDataCell>

                                        </CTableRow>
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
        </div>
    );
};

export default Status;
