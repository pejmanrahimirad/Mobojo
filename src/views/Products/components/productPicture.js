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
    Spinner,
    Button,
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
import Library from "src/views/media/Library";
import "react-toastify/dist/ReactToastify.css";
import "../style.css";
import CIcon from "@coreui/icons-react";
import { cibAddthis, cilTrash } from "@coreui/icons";
import { useParams } from 'react-router-dom'
import history from "src/context/auth/history";
const ProductPicture = () => {
    const [productId, setProductId] = useState(null)
    const [product, setProduct] = useState(null)
    const [modal, setModal] = useState(false)
    const [images, setImages] = useState([])
    let params = useParams()
    useEffect(() => {
        const { productid } = params;
        if (!productid) {
            history.replace('/products/products', { some: 'state' })
            history.go()
        } else {
            setProductId(productid)
            axios({
                url: "/",
                method: "post",
                data: {
                    query: `query GetProduct($page: Int, $limit: Int, $productId: ID) {
                  getProduct(page: $page, limit: $limit, productId: $productId) {
                    _id
                    fname
                    images {
                        _id
                        dir
                      }
                  }
                }`,
                    variables: {
                        "page": 1,
                        "limit": 10,
                        "productId": productid

                    },
                },
            }).then((res) => {
                if (res.data.data != null) {
                    const { getProduct } = res.data.data
                    const product = getProduct[0]
                    console.log(product)
                    setProduct(product)

                } else {
                    toast.error(res.data.errors[0].message);
                }
            });

        }
    }, [])
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
    }
    const showModal = () => {
        setModal(true)
    }
    const insertImage = () => {
        setModal(false)
        const productTemp = product
        images.forEach(element => {
           productTemp.images.push(element)
        });
        setProduct(productTemp)
    }

    const removeImage = (index) => {
        const productTemp = { ...product }
        productTemp.images.splice(index, 1)
        console.log(productTemp)
        setProduct(productTemp)
    }
    const submitProductPic = () => {
        const tempProduct = []
        product.images.forEach(element => {
            tempProduct.push(element._id)
        });
        console.log(tempProduct)
        axios({
            url: "/",
            method: "post",
            data: {
                query: `mutation UpdateProductImages($input: InputProductImages) {
                    updateProductImages(input: $input) {
                      message
                      status
                    }
                  }`,
                variables: {
                    "input": {
                        "imagesId": tempProduct,
                        "productId": productId
                    }

                },
            },
        }).then((res) => {
            if (res.data.data != null) {
                history.replace('/products/products', { some: 'state' })
                history.go()

            } else {
                toast.error(res.data.errors[0].message);
            }
        });
    }
    return (
        <div className="animated fadeIn">
            <ToastContainer />
            {(product != null) ?
                <Card>
                    <CardHeader className="InsertPicHeader">
                        <h6>اضافه کردن تصویر محصول {product.fname}</h6>
                        <Button size="sm" color="danger" onClick={showModal}>انتخاب تصویر</Button>
                    </CardHeader>
                    <CardBody>
                        <FormGroup row className="my-0">
                            <Row>
                                {
                                    product.images.map((item, index) => {
                                        return (
                                            <div className="media" key={index}>
                                                <div className="addImageToProductItem">
                                                    <div>
                                                        <Button size="sm" color="danger" onClick={() => removeImage(index)} >
                                                            <CIcon
                                                                icon={cilTrash}
                                                                color="success"
                                                                size="sm"
                                                            />
                                                        </Button>
                                                    </div>
                                                    <img src={`${process.env.REACT_APP_PUBLIC_URL}${item.dir}`} alt={item.name} />
                                                </div>
                                            </div>)
                                    })
                                }
                            </Row>
                        </FormGroup>
                    </CardBody>
                    <CardFooter>
                        <Button size="sm" color="primary" block onClick={submitProductPic}>ثبت</Button>
                    </CardFooter>
                </Card>
                :

                <Spinner />
            }
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
    )
}
export default ProductPicture;