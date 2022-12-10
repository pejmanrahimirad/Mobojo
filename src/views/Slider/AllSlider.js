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
const AllSlider = (props) => {
    const { reload } = props
    const [allSlider, setAllSlider] = useState([])
    const [reloadd, setReloadd] = useState(false)
    useEffect(() => {
        axios({
            url: "/",
            method: "post",
            data: {
                query: `query getAllSlider {
                    getAllSlider {
                      _id
                      default
                      images {
                        _id
                        dir
                      }
                      name
                   
                    }
                  }`,

            },
        }).then((res) => {
            if (res.data.data != null) {
                const { getAllSlider } = res.data.data;
                getAllSlider.map((item) => { return (item.flag = false, item.delete = false) })
                setAllSlider(getAllSlider)
            } else {
                toast.error(res.data.errors[0].message);
            }
        });
    }, [reload, reloadd]);
    const handleEdit = (index) => {
        const tempSliders = [...allSlider]
        tempSliders[index].flag = !tempSliders[index].flag
        setAllSlider(tempSliders)
    }

    const submitEdit = (item, target) => {
        let del, update;
        switch (target) {
            case "update":
                update = true;
                break;
            case "delete":
                del = true;
                break;
        }
        axios({
            url: "/",
            method: "post",
            data: {
                query: ` mutation updateSlider($input : UpdateSlider!){
                    updateSlider(input : $input){
                        message
                        status
                    }
                }`, variables: {
                    "input": {
                        _id: item._id,
                        default: update,
                        delete: del

                    }
                }
            }
        }).then((res) => {
            if (res.data.data != null) {
                setReloadd(!reloadd)
                if(del){
                    toast.warning("با موفقیت حذف گردید");

                }else{
                    toast.success("با موفقیت تغییر کرد");
                }
            } else {
                toast.error(res.data.errors[0].message);
            }
        });
    }


    const handleDelete = (index) => {
        const tempBanners = [...allSlider]
        tempBanners[index].delete = !tempBanners[index].delete
        console.log(tempBanners[index])
        setAllSlider(tempBanners)
    }
    return (
        <Card>
            <CardHeader>
                لیست اسلایدر ها
            </CardHeader>
            <CardBody>
                {
                    allSlider.length > 0 ?
                        <CTable>
                            <CTableHead color="dark">
                                <CTableRow>
                                    <CTableHeaderCell scope="col">نام اسلایدر</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">تصویر</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">وضعیت</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {allSlider.map((item, index) => {
                                    return (
                                        <CTableRow key={item._id} style={item.default ? { background: '#f0f3f5' } : null}>
                                            <CTableDataCell>{item.name}</CTableDataCell>
                                            <CTableDataCell>
                                                <img
                                                    src={`${process.env.REACT_APP_PUBLIC_URL}${item.images[0].dir}`}
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
                                                        <CButton size="sm" color="success" onClick={() => submitEdit(item,"update")}>تغییر</CButton>
                                                        <CButton size="sm" color="warning" onClick={() => handleEdit(index)}>لغو</CButton>
                                                    </div>
                                                    :
                                                    item.delete ?
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-around'
                                                        }}>
                                                            <CButton size="sm" color="danger" onClick={() => submitEdit(item,"delete")}>حذف</CButton>
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

export default AllSlider;