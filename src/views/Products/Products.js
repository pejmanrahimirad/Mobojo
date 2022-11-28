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
import AddSeller from "./components/addSeller";
const token = GetToken();

const Products = (props) => {

  const [products, setProducts] = useState([])
  const [modalInfoSeller, setModalInfoSeller] = useState(false)
  const [attribute, setAttribute] = useState([])
  const [productId, setProductId] = useState(null)
  const [productName, setProductName] = useState('')
  const [modalAddSeller, setModalAddSeller] = useState(false)
  const [mainSubTitleFromServer, setMainSubTitleFromServer] = useState([]);
  const [catId, setCatId] = useState(null)
  const [sellers, setSellers] = useState([])
  const [sellerId, setSellerId] = useState(null)
  const [allWarranty, setAllWarranty] = useState([])
  const [warrantyId, setWarrantyId] = useState(null)
  const [color, setColor] = useState(null)
  const [numberOfProduct, setNumberOfProduct] = useState(null)
  const [price, setPrice] = useState(0)
  const [discount, setDiscount] = useState(0)
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
              _id
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
            mainCategory: true,
            parentCategory: false,
            catId: null,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        // console.log(res);
        const { getAllCategory } = res.data.data;
        setMainSubTitleFromServer(getAllCategory);

        // toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    })

    axios({
      url: "/",
      method: "post",
      data: {
        query: `query Query {
            getAllWarranty {
              _id
              name
              label
            }
          }`,
      },
    }).then((res) => {
      if (res.data.data != null) {
        const { getAllWarranty } = res.data.data;
        setAllWarranty(getAllWarranty);
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
  const handleChangeStock = (event, id) => {
    const field = { ...attribute[id] }
    field.stock = event.target.value
    const newAttributeState = [...attribute]
    newAttributeState[id] = field
    setAttribute(newAttributeState)
  }
  const handleChangeColor = (event, id) => {
    const field = { ...attribute[id] }
    field.color = event.target.value
    const newAttributeState = [...attribute]
    newAttributeState[id] = field
    setAttribute(newAttributeState)
  }
  const handleChangePrice = (event, id) => {
    const field = { ...attribute[id] }
    field.price = event.target.value
    const newAttributeState = [...attribute]
    newAttributeState[id] = field
    setAttribute(newAttributeState)
  }
  const handleChangeDiscount = (event, id) => {
    const field = { ...attribute[id] }
    field.discount = event.target.value
    const newAttributeState = [...attribute]
    newAttributeState[id] = field
    setAttribute(newAttributeState)
  }
  const handleSuggestion = (id, value) => {
    const field = { ...attribute[id] }
    field.suggestion = value
    const newAttributeState = [...attribute]
    newAttributeState[id] = field
    setAttribute(newAttributeState)
  }
  const editSellers = () => {
    const attributeHolder = []
    attribute.map((item) => {
      attributeHolder.push({
        id: item._id,
        seller: item.seller._id,
        warranty: item.warranty._id,
        color: item.color,
        price: parseFloat(item.price),
        discount: parseFloat(item.discount),
        stock: parseFloat(item.stock),
        suggestion: item.suggestion
      })
    })
    console.log(attributeHolder)
    axios({
      url: "/",
      method: "post",
      data: {
        query: `mutation Mutation($input: InputProductAttribute) {
          updateProductAttribute(input: $input) {
            status
            message
          }
        }`,
        variables: {
          "input": {

            "attribute": attributeHolder
          }
        },
      },
    }).then((res) => {
      console.log(res);
      if (res.data.data != null) {
        const { message } = res.data.data.updateProductAttribute;
        toast.success(message)
        setModalInfoSeller(false)
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  }
  const toggleAddSeller = (name, id) => {
    if (!modalAddSeller) {
      setProductName(name)
      setProductId(id)
      setModalAddSeller(true)
    } else {
      setProductName('')
      setProductId(null)
      setModalAddSeller(false)
    }
  }
  const categoryHandler = (event) => {
    setCatId(event.target.value)
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query Query($categoryId: ID!) {
          getAllSeller(categoryId: $categoryId) {
            _id
            name
            label
          }
        }`,
        variables: {
          categoryId: event.target.value,
        },
      },
    }).then((res) => {
      console.log(res);
      if (res.data.data != null) {
        const { getAllSeller } = res.data.data;
        setSellers(getAllSeller);
      } else {
        setSellers([]);
      }
    });
  }
  const sellerHandler = (event) => {
    setSellerId(event.target.value)
  }
  const warrantyHandler = (event) => {
    setWarrantyId(event.target.value)
  }
  const colorHandler = (event) => {
    setColor(event.target.value)
  }
  const numberOfProductHandler = (event) => {
    setNumberOfProduct(event.target.value)
  }
  const priceHandler = (event) => {
    setPrice(event.target.value)
  }
  const discountHandler = (event) => {
    setDiscount(event.target.value)
  }
  const addSellerToProduct = () => {
  
    axios({
      url: "/",
      method: "post",
      data: {
        query: `mutation Mutation($input: InputProductAttribute) {
          updateProductAttribute(input: $input) {
            status
            message
          }
        }`,
        variables: {
          "input": {
            "productId": productId,
            "attribute": [
              {
                "seller": sellerId,
                "warranty": warrantyId,
                "color": color,
                "stock": parseInt(numberOfProduct),
                "price": parseFloat(price),
                "discount": parseFloat(discount),
              }
            ]
          }
        },
      },
    }).then((res) => {
      const data=res.data.data
      if (data != null) {
        const {updateProductAttribute}=data
        setProductId(null)
        setSellerId(null)
        setWarrantyId(null)
        setColor('')
        setNumberOfProduct(0)
        setPrice(0)
        setDiscount(0)
        toggleAddSeller()
         toast.success(updateProductAttribute.message);
      } else {
        toast.error(res.data.errors[0].message);
      }
    })

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
                  const pictureLink = `/products/picture/${item._id}`

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
                        <CButton color="danger" size="sm" onClick={() => toggleAddSeller(item.fname, item._id)}>
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
                        <NavLink to={link}>

                          <CIcon
                            icon={cilPen}
                            color="success"
                            size="sm"
                          />
                          </NavLink>
                        </CButton>
                        <CButton color="warning" size="sm">
                          <NavLink to={pictureLink}>
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
        editSellers={editSellers}
      /> : null
    }
    {
      modalAddSeller ?
        <AddSeller
          modal={modalAddSeller}
          toggle={toggleAddSeller}
          productName={productName}
          categoryHandler={categoryHandler}
          allCategory={mainSubTitleFromServer}
          sellers={sellers}
          sellerHandler={sellerHandler}
          allWarranty={allWarranty}
          warrantyHandler={warrantyHandler}
          colorHandler={colorHandler}
          numberOfProduct={numberOfProduct}
          numberOfProductHandler={numberOfProductHandler}
          price={price}
          priceHandler={priceHandler}
          discount={discount}
          discountHandler={discountHandler}
          addSellerToProduct={addSellerToProduct}
        />

        :
        null
    }
  </div>)
}

export default Products;