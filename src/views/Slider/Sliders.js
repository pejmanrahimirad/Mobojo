
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
    Badge,
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
import { cibAddthis, cibCplusplus, cilAlignCenter, cilAlignRight, cilHamburgerMenu, cilTrash } from "@coreui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import Library from "../media/Library";
import axios from "axios";
import AllSlider from "./AllSlider";
const Slider = (props) => {
    const [title, setTitle] = useState('')
    const [checked, setChecked] = useState(false)
    const [modal, setModal] = useState(false)
    const [images, setImages] = useState([])
    const [reload, setReload] = useState(false)

    const handleTitle = (event) => {
        setTitle(event.target.value)
    }
    const setDefault = () => {
        setChecked(!checked)
    }

    const toggleLarge = () => {
        setModal(!modal)
    }

    const addImage = (item) => {
        const find=[...images].filter(x=>{return x._id==item._id})
        console.log(find)
        if(find.length>0){
            console.log('تصویر تکراری')
        }else{
            const newImages = images
            newImages.push({
                "_id": item._id,
                "dir": item.dir
            })
            setImages(newImages)
        }
       
    }

    const insertImage = () => {
        setModal(false)
    }
    const removeImage = (index) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)
    }

    const handleSubmit = () => {
       const imagesServer=[]
       images.map(item=>imagesServer.push(item._id));
        axios({
                url: '/',
                method: 'POST',
                data: {
                    query: ` mutation addSlider($input : InputSlider!){
                        addSlider(input : $input){
                            message
                            status
                        }
                    }`,variables:{
                        "input":{
                            name:title,
                            images:imagesServer,
                            default:checked
                        }
                    }}
            }).then((res) => {
                if (res.data.data != null) {
                    toast.success('اسلایدر با موفقیت ذخیره گردید')
                    setImages([])
                    setChecked(false)
                    setTitle('')
                    setReload(!reload)
                }else{
                    toast.warning(res.data.errors[0].message)
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
                    <span>اضافه کردن اسلایدر</span>
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
                            <Label htmlFor="default">  تعیین به عنوان اسلایدر پیشفرض  </Label>
                            <Input
                                id={"default"}
                                type={'checkbox'}
                                value={checked}
                                onChange={setDefault}
                            ></Input>
                        </Col>
                        <Col lg="4">
                            <div> انتخاب تصویر </div>

                            <Badge color="danger">
                                <CIcon
                                    icon={cibAddthis}
                                    onClick={toggleLarge}
                                    color="success"
                                    size="lg"
                                // onClick={addField}
                                />
                            </Badge>
                        </Col>
                    </Row>
                    <CardBody>
                        <FormGroup row className="my-0">
                            <Row>
                                {
                                    images.map((item, index) => {
                                        return (
                                            <div className="media" key={index}>
                                                <div className="addImageToProductItem">
                                                    <div>
                                                        <Badge size="sm" color="danger"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <CIcon
                                                                icon={cilTrash}
                                                                color="success"
                                                                size="sm"
                                                            />
                                                        </Badge>
                                                    </div>
                                                    <img src={`${process.env.REACT_APP_PUBLIC_URL}${item.dir}`} alt={item.name} />
                                                </div>
                                            </div>)
                                    })
                                }
                            </Row>
                        </FormGroup>
                    </CardBody>
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
            <br />
            <AllSlider  reload={reload}/>
            {
                modal ?
                    <Library
                        modal={modal}
                        toggleLarge={toggleLarge}
                        addImage={addImage}
                        multi={true}
                        insertImage={insertImage}
                    /> :
                    null
            }
        </div>
    );
}

export default Slider;
