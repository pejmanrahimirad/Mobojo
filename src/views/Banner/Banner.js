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
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Library from "../media/Library";
import '../media/media.css'
import AllBanner from "./AllBanners";
const Banner = (props) => {

  const [mainCat, setMainCat] = useState(true);
  const [parentCat, setParentCat] = useState(false);
  const [mainSubTitleFromServer, setMainSubTitleFromServer] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [thirdSubCat, setThirdSubCat] = useState([]);
  const [catId, setCatId] = useState(null);
  const [subCatId, setsubCatId] = useState(null);
  const [thirdSubCatId, setThirdSubCatId] = useState("");
  const [checked, setChecked] = useState(false)
  const [modal, setModal] = useState(false)
  const [images, setImages] = useState([])
  const [reload,setReload]=useState(false)

  useEffect(() => {
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query Query($input: InputgetCategory) {
            getAllCategory(input: $input) {
              _id
              name
              label
              parent {
                _id
                name
              }
              image {
                _id
                dir
                name
              }
            }
          }`,
        variables: {
          input: {
            //   page: 1,
            //   limit: 30,
            mainCategory: mainCat,
            parentCategory: parentCat,
            catId: catId,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        // console.log(res);
        const { getAllCategory } = res.data.data;
        if (mainCat) {
          setMainSubTitleFromServer(getAllCategory);
        }
        if (parentCat) {
          setSubCategory(getAllCategory);
        }
        // toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  }, [catId]);

  const categoryHandler = (event) => {
    setParentCat(true);
    setMainCat(false);
    setCatId(event.target.value);

  };

  const subCategoryHandler = (event) => {
    setsubCatId(event.target.value);
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query GetAddProductInfo($categoryId: ID, $subCategory: ID, $getSubCategory: Boolean) {
          getAddProductInfo(categoryId: $categoryId, subCategory: $subCategory, getSubCategory: $getSubCategory) {
      
            subCate {
              _id
              name
            }
          }
        }`,
        variables: {
          categoryId: null,
          subCategory: event.target.value,
          getSubCategory: true,
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        const { brands, subCate, specs } = res.data.data.getAddProductInfo;
        setThirdSubCat(subCate);
      } else {
        toast.error(res.data.errors[0].message);
        setThirdSubCat([]);
      }
    });
  };
  const thirdSubCatHandler = (event) => {
    setThirdSubCatId(event.target.value);
  };


  const setEnable = () => {
    setChecked(!checked)
  }
  const showModal = () => {
    if (images.length > 0) {
      toast.error('لطفا عکس قبلی را حذف کنید تا بتوانید عکس جدید را انتخاب کنید')
    } else {
      setModal(true)
    }
  }
  const toggleLarge = () => {
    setModal(!modal)
  }
  const addImage = (item) => {
    const newImages = [...images]
    newImages.push({
      "_id": item._id,
      "dir": item.dir
    })
    setImages(newImages)
    setModal(false)
  }
  const addBanner=()=>{
    let IDforServer=null;
    if(thirdSubCatId){
      // console.log(thirdSubCatId)
      IDforServer=thirdSubCatId
    }else{
      IDforServer=subCatId
    }
    const tempImage=images[0]._id
    axios({
      url: "/",
      method: "post",
      data: {
        query: `mutation Mutation($input: InputBanner!) {
          addBanner(input: $input) {
            message
            status
          }
        }`,
        variables: {
          input: {
            category: IDforServer,
            default: checked,
            image: tempImage,
            name: "name",
          }
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
       setReload(!reload)
        toast.success("بنر با موفقیت اضافه شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  }

  return (
    <div className="animated fadeIn">
      <ToastContainer />
      <Card>
        <CardHeader>
          <h6>اضافه کردن بنر</h6>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="3">
              <FormGroup>
                <label htmlFor="label">دسته اصلی</label>
                <Input
                  type="select"
                  id="mainCategory"
                  value={catId}
                  onChange={categoryHandler}
                  required
                >
                  <option>انتخاب کنید</option>
                  {mainSubTitleFromServer.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <label htmlFor="label">زیر دسته</label>
                <Input
                  type="select"
                  id="subCategory"
                  value={subCatId}
                  onChange={subCategoryHandler}
                  required
                >
                  <option>انتخاب کنید</option>
                  {subCategory != null
                    ? subCategory.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))
                    : null}
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <label htmlFor="label">زیر دسته دوم</label>
                <Input
                  type="select"
                  id="thirdCategory"
                  value={thirdSubCatId}
                  onChange={thirdSubCatHandler}
                  required
                >
                  <option>انتخاب کنید</option>
                  {thirdSubCat != null
                    ? thirdSubCat.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))
                    : null}
                </Input>
              </FormGroup>
            </Col>
            <Col md="3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CButton onClick={showModal} size="sm" color="danger" >
                انتخاب عکس
              </CButton>
            </Col>
            <Col md="5">
              <FormGroup check>
                <Label htmlFor="enable" check>فعال بودن</Label>
                <Input type="checkbox" id="enable" value={checked} onChange={setEnable} />
              </FormGroup>
            </Col>
            <Col md="5">
              <div className="mediaSection">
                {
                 images!=null? images.map((item, index) => {
                    return (
                      <div key={index} style={{ width: 'auto',position:'relative' }}>
                        <span
                          onClick={() => setImages(null)}
                          style={{
                            position: "absolute",
                            color: "white",
                            background: "red",
                            borderRadius: 5,
                            padding: 5,
                            top: 15,
                            right: 15,
                            lineHeight: 0.8,
                            cursor: "pointer",
                          }}
                        >
                          x
                        </span>
                        <img
                          src={`${process.env.REACT_APP_PUBLIC_URL}${item.dir}`}
                          alt={item._id}
                          style={{
                            height: "200px",
                            width: "200px",
                            borderRadius: 5,
                            margin: 10,
                          }}
                        />
                      </div>
                    )
                  }):null
                }
              </div>
            </Col>
          </Row>
        </CardBody>
        <CardFooter className="footer">
          <CRow>
            <CButton type="submit" color="primary" onClick={addBanner} >
              <strong>ثبت</strong>
            </CButton>
          </CRow>
        </CardFooter>
      </Card>
      <AllBanner reload={reload} />
      {
        modal ?
          <Library
            modal={modal}
            toggleLarge={toggleLarge}
            addImage={addImage}
          // multi={true}
          // insertImage={insertImage}
          /> :
          null
      }
    </div>
  );
};

export default Banner;
