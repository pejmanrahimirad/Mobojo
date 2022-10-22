import React, {
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
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
  CRow as div,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { NavLink } from 'react-router-dom'
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import CIcon from "@coreui/icons-react";
import { cilPlus, cibAddthis, cilImage, cilPen, cilTrash, cilScreenDesktop } from "@coreui/icons";
import { checkType, checkFileSize } from "../media/Funcs";
import { InsertImage } from "./components/insertImage";
import ProductSeller from "./components/ProductSeller";
import GetToken from "src/context/auth/GetToken";
const token = GetToken();

const Products = (props) => {

  const [products, setProducts] = useState([])
  const [modalInfoSeller, setModalInfoSeller] = useState(false)
  const [attribute, setAttribute] = useState([])
  const [productName, setProductName] = useState('')
  useEffect(() => {
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query GetProduct($page: Int, $limit: Int, $productId: ID) {
          getProduct(page: $page, limit: $limit, productId: $productId) {
            _id
            fname
            original
            ename
            brand{name}
            category {
              _id
              name
              label
              image {
                name
                _id
              }
            }
            attribute {
              suggestion
              seller {
                _id
                name
              }
              color
              stock
              price
              discount
              warranty {
                _id
                name
              }
            }
            details {
              pdetails {
                _id
                name
              }
              value
            }
            description
            images {
              dir
              _id
            }
            soldCount
            rate
          }
        }`,
        variables: {
          "page": 1,
          "limit": 10,
          "productId": null
        },
      },
    }).then((res) => {
      // console.log(res)
      if (res.data.data != null) {
        const { getProduct } = res.data.data;
        console.log(getProduct);
        setProducts(getProduct)
        // toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  }, [])

  const toggleinfoSeller = (attr, name) => {
    if (!modalInfoSeller) {
      setAttribute(attr)
      setProductName(name)
      setModalInfoSeller(true)
    } else {
      setAttribute([])
      setModalInfoSeller(false)

    }
  }
  const handleChangeStock=(event,id)=>{
    const field = { ...attribute[id] }
    field.stock =event.target.value
    const newAttributeState=[...attribute]
    newAttributeState[id]=field
    setAttribute(newAttributeState)
  }
  const handleChangeColor = (event, id) => {
    const field = { ...attribute[id] }
    field.color=event.target.value
    const newAttributeState=[...attribute]
    newAttributeState[id]=field
    setAttribute(newAttributeState)
  }
  const handleChangePrice=(event, id) => {
    const field = { ...attribute[id] }
    field.price=event.target.value
    const newAttributeState=[...attribute]
    newAttributeState[id]=field
    setAttribute(newAttributeState)
  }
  const handleChangeDiscount=(event, id) => {
    const field = { ...attribute[id] }
    field.discount=event.target.value
    const newAttributeState=[...attribute]
    newAttributeState[id]=field
    setAttribute(newAttributeState)
  }
  const handleSuggestion=(id,value)=>{
    console.log('hi')
    const field = { ...attribute[id] }
    field.suggestion=value
    const newAttributeState=[...attribute]
    newAttributeState[id]=field
    setAttribute(newAttributeState)
  }
  return (<div className="animated fadeIn">
    <ToastContainer />
    <Card>
      <CardHeader>
        <h6>لیست محصولات </h6>
      </CardHeader>
      <CardBody>
        <CTable>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">نام محصول</CTableHeaderCell>
              <CTableHeaderCell scope="col">تصویر</CTableHeaderCell>
              <CTableHeaderCell scope="col">برند</CTableHeaderCell>
              <CTableHeaderCell scope="col">فروشندگان</CTableHeaderCell>
              <CTableHeaderCell scope="col">امتیاز</CTableHeaderCell>
              <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {
              products.length > 0 ?

                products.map((item) => {
                  const link = `/products/product/${item._id}`
                  const pictureLink = `/products/product/picture/${item._id}`

                  return (<CTableRow key={item._id}>
                    <CTableDataCell>
                      {item.fname}<br />
                      {item.ename}
                    </CTableDataCell>
                    <CTableDataCell>
                      <img className="table-img" src={`${process.env.REACT_APP_PUBLIC_URL}${item.original}`} />
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.brand.name}
                    </CTableDataCell>
                    <CTableDataCell >
                      <div className="flex-inline">
                        <CButton color="primary" size="sm" onClick={() => toggleinfoSeller(item.attribute, item.fname)}>
                          <CIcon
                            icon={cilScreenDesktop}
                            color="success"
                            size="sm"
                          />
                        </CButton>
                        <CButton color="danger" size="sm">
                          <CIcon
                            icon={cilPlus}
                            color="success"
                            size="sm"
                          />
                        </CButton>
                      </div>
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.rate}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="flex-inline">

                        <CButton color="primary" size="sm">
                          <CIcon
                            icon={cilPen}
                            color="success"
                            size="sm"
                          />
                        </CButton>
                        <CButton color="warning" size="sm">
                          <NavLink to={link}>
                            <CIcon
                              icon={cilImage}
                              color="success"
                              size="sm"
                            />
                          </NavLink>

                        </CButton>
                        <CButton color="danger" size="sm">
                          <CIcon
                            icon={cilTrash}
                            color="success"
                            size="sm"
                          />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>)
                })
                : null
            }
          </CTableBody>
        </CTable>
      </CardBody>

    </Card>
    {modalInfoSeller ?
      <ProductSeller
        modal={modalInfoSeller}
        toggle={toggleinfoSeller}
        attribute={attribute}
        productName={productName}
        handleChangeColor={handleChangeColor}
        handleChangeStock={handleChangeStock}
        handleChangePrice={handleChangePrice}
        handleChangeDiscount={handleChangeDiscount}
        handleSuggestion={handleSuggestion}
      /> : null
    }
  </div>)
}

export default Products;