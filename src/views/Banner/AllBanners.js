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

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
const AllBanner = (props) => {
    const { reload } = props
    const [allBanner, setAllBanner] = useState([])
    const [reloadd, setReloadd] = useState(false)
    useEffect(() => {
        axios({
            url: "/",
            method: "post",
            data: {
                query: `query GetAllBanner {
                getAllBanner {
                  _id
                  default
                  image {
                    name
                    _id
                    dir
                  }
                  name
                  category {
                    _id
                    name
                  }
                }
              }`,

            },
        }).then((res) => {
            if (res.data.data != null) {
                const { getAllBanner } = res.data.data;
                getAllBanner.map((item) => { return (item.flag = false, item.delete = false) })
                console.log(getAllBanner);
                setAllBanner(getAllBanner)
            } else {
                toast.error(res.data.errors[0].message);
            }
        });
    }, [reload, reloadd]);
    const handleEdit = (index) => {
        const tempBanners = [...allBanner]
        tempBanners[index].flag = !tempBanners[index].flag
        setAllBanner(tempBanners)
    }

    const submitEdit = (item) => {
        console.log(item)
        axios({
            url: "/",
            method: "post",
            data: {
                query: `mutation Mutation($bannerId: ID!, $default: Boolean) {
                    updateBanner(bannerId: $bannerId, default: $default) {
                      message
                      status
                    }
                  }`,
                variables: {
                    bannerId: item._id,
                    default: (!item.default)
                }

            },
        }).then((res) => {
            if (res.data.data != null) {
                setReloadd(!reloadd)
                toast.success("با موفقیت تغییر کرد");
            } else {
                toast.error(res.data.errors[0].message);
            }
        });
    }

    const submitDelete = (item) => {
        console.log(item)
        axios({
            url: "/",
            method: "post",
            data: {
                query: `mutation Mutation($bannerId: ID!, $delete: Boolean) {
                    updateBanner(bannerId: $bannerId, delete: $delete) {
                      message
                      status
                    }
                  }`,
                variables: {
                    bannerId: item._id,
                    delete: true
                }

            },
        }).then((res) => {
            if (res.data.data != null) {
                setReloadd(!reloadd)
                toast.success("با موفقیت حذف کرد");
            } else {
                toast.error(res.data.errors[0].message);
            }
        });
    }

    const handleDelete=(index)=>{
        const tempBanners = [...allBanner]
        tempBanners[index].delete = !tempBanners[index].delete
        console.log(tempBanners[index])
        setAllBanner(tempBanners)
    }
    return (
        <Card>
            <CardHeader>
                لیست بنر ها
            </CardHeader>
            <CardBody>
                {
                    allBanner.length > 0 ?
                        <CTable>
                            <CTableHead color="dark">
                                <CTableRow>
                                    <CTableHeaderCell scope="col">نام دسته</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">تصویر</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">وضعیت</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {allBanner.map((item, index) => {
                                    return (
                                        <CTableRow key={item._id} style={item.default ? { background: '#f0f3f5' } : null}>
                                            <CTableDataCell>{item.category.name}</CTableDataCell>
                                            <CTableDataCell>
                                                <img
                                                    src={`${process.env.REACT_APP_PUBLIC_URL}${item.image.dir}`}
                                                    alt={item.name}
                                                    style={{ height: "64px", width: "64px" }}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {
                                                    item.default ? "فعال" : "غیر فعال"
                                                }
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {item.flag ?
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-around'
                                                    }}>
                                                        <CButton size="sm" color="success" onClick={() => submitEdit(item)}>تغییر</CButton>
                                                        <CButton size="sm" color="warning" onClick={() => handleEdit(index)}>لغو</CButton>
                                                    </div>
                                                    :
                                                    item.delete?
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-around'
                                                    }}>
                                                        <CButton size="sm" color="danger" onClick={() => submitDelete(item)}>حذف</CButton>
                                                        <CButton size="sm" color="warning" onClick={() => handleDelete(index)}>لغو</CButton>
                                                    </div>
                                                    :
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-around'
                                                    }}>
                                                        <CButton size="sm" color="primary" onClick={() => handleEdit(index)}>ویرایش</CButton>
                                                        <CButton size="sm" color="danger" onClick={() => handleDelete(index)}>حذف</CButton>

                                                    </div>
                                                }
                                            </CTableDataCell>
                                        </CTableRow>
                                    );
                                })}
                            </CTableBody>
                        </CTable>

                        : <center><Spinner /></center>
                }
            </CardBody>
        </Card >)
}

export default AllBanner;