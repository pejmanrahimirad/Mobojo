import React, {
  useEffect,
  useState,

} from "react";
import { useParams } from 'react-router-dom'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormGroup,
  Input,
  Col,
  Row,
  Label,
  Spinner,
} from "reactstrap";
import {
  CButton,
  CRow,
} from "@coreui/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { PejmanCKEditor } from "../pejmanComponents/CKEditor";
import { checkType, checkFileSize } from "../media/Funcs";
import { InsertImage } from "./components/insertImage";

import GetToken from "src/context/auth/GetToken";
import history from "src/context/auth/history";
const token = GetToken();
const EditProduct = (props) => {

  const [fname, setFname] = useState("");
  const [ename, setEname] = useState("");
  const [mainCat, setMainCat] = useState(true);
  const [parentCat, setParentCat] = useState(false);
  const [catId, setCatId] = useState('');
  const [subCatId, setsubCatId] = useState(null);
  const [mainSubTitleFromServer, setMainSubTitleFromServer] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [thirdSubCat, setThirdSubCat] = useState([]);
  const [warranty, setWarranty] = useState([]);
  const [thirdSubCatId, setThirdSubCatId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [warrantyId, setWarrantyId] = useState("");
  const [color, setColor] = useState("black");
  const [count, setCount] = useState(1);
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [info, setInfo] = useState([]);
  const [specss, setSpecs] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [brandName, setBrandName] = useState("")
  const [imageServer, setImageServer] = useState("")
  const [categoryName, setCategoryName] = useState('')
  const [subCategoryName, setSubCategoryName] = useState('')
  const [thirdCategoryName, setThirdCategoryName] = useState('')
  const [productId, setProductId] = useState(null)
  let params = useParams()
  useEffect(() => {
    const { productid } = params;
    if (!productid) {
      history.replace('/products', { some: 'state' })
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
                original
                ename
                brand{ 
                  _id
                  name}
                category {
                  _id
                  name
                  label
                  parent{
                    _id
                    name
                    parent{
                      _id
                      name
                    }
                  }
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
                  _id
                  label
                  value
                  pdetails {
                    _id
                    name
                    label
                  }
                  
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
            "productId": productid

          },
        },
      }).then((res) => {
        if (res.data.data != null) {
          const { getProduct } = res.data.data;
          const product = getProduct[0]
          console.log(product)
          setFname(product.fname)
          setEname(product.ename)
          setBrandName(product.brand.name)
          setImageServer(product.original)
          setDescription(product.description)
          setInfo(product.attribute)
          let specId = null;

          if (product.category.parent.parent != null) {
            setCategoryName(product.category.parent.parent.name)
            setSubCategoryName(product.category.parent.name)
            setThirdCategoryName(product.category.name)
            specId = product.category.parent._id
            setsubCatId(specId)
          }
          else {
            setCategoryName(product.category.parent.name)
            setSubCategoryName(product.category.name)
            specId = product.category._id
            setsubCatId(specId)
          }

          axios({
            url: "/",
            method: "post",
            data: {
              query: `query GetAddProductInfo($subCategory: ID, $getSubCategory: Boolean) {
                getAddProductInfo(subCategory: $subCategory, getSubCategory: $getSubCategory) {
                  specs {
                    _id
                    specs
                    details {
                      _id
                      name
                      label
              
                    }
                  }
                }
              }`,
              variables: {
                "subCategory": "630a1bc0b21606a609cea86f",
                "getSubCategory": true

              },
            },


          }).then((res) => {
            if (res.data.data != null) {
              const { specs } = res.data.data.getAddProductInfo;
              for (let i = 0; i < specs.length; i++) {
                const elmt = specs[i];
                for (let j = 0; j < elmt.details.length; j++) {
                  const elmtj = elmt.details[j];
                  for (let c = 0; c < product.details.length; c++) {
                    const elmtc = product.details[c];
                    if (elmtc.pdetails._id == specs[i].details[j]._id) {
                      elmt.details[j].value = product.details[c].value
                      elmt.details[j].label = product.details[c].label
                      elmt.details[j].ID = product.details[c]._id
                    }
                  }
                }
                setSpecs(specs)
              }
            } else {
              toast.error(res.data.errors[0].message);
            }
          });

          setLoading(false)

        } else {
          toast.error(res.data.errors[0].message);
        }
      });

    }
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
            mainCategory: mainCat,
            parentCategory: parentCat,
            catId: catId,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
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
  useEffect(() => {
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query GetAllWarranty {
            getAllWarranty {
              _id
              name
            }
          }`,
      },
    }).then((res) => {
      if (res.data.data != null) {
        const { getAllWarranty } = res.data.data;
        setWarranty(getAllWarranty);
        // toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  }, []);
  const handleSubmit = () => {

    const SpecArray = []
    specss.map(spec => {
      return spec.details.map(item => {
        SpecArray.push({
          _id: item.ID,
          value: item.value,
          label: item.label
        })
      })
    })
    if (image) {
      let datawithFile = {
        query: `mutation UpdateProduct($input: InputUpdateProduct) {
          updateProduct(input: $input) {
            message
            status
          }
        }`,
        variables: {
          input: {
            _id: productId,
            fname: fname,
            ename: ename,
            details: SpecArray,
            description: description,
            oniginal: null,
          },
        },
      }

      let map = {
        0: ["variables.input.oniginal"],
      };
      const FormD = new FormData();
      FormD.append("operations", JSON.stringify(datawithFile));
      FormD.append("map", JSON.stringify(map));
      FormD.append(0, file, file.name);
      axios({
        url:'/',
        method:'post',
        data:FormD
      }).then((res)=>{
            if (res.data.data != null) {
            toast.success("محصول با موفقیت ویرایش شد");
            history.replace('/products/products', { some: 'state' })
            history.go()
          } else {
            toast.error("ویرایش محصول  با مشکل روبه رو شد");
          }
      })
    }else{
    let data = {
      query: `mutation UpdateProduct($input: InputUpdateProduct) {
        updateProduct(input: $input) {
          message
          status
        }
      }`,
      variables: {
        input: {
          _id: productId,
          fname: fname,
          ename: ename,
          details: SpecArray,
          description: description,
        },
      },
    }
    axios({
      url:'/',
      method:'post',
      data:data
    }).then((res)=>{
      if (res.data.data != null) {
        toast.success("محصول با موفقیت ویرایش شد");
        history.replace('/products/products', { some: 'state' })
        history.go()
      } else {
        toast.error("ویرایش محصول  با مشکل روبه رو شد");
      }
    })
  
  }
  };
  const handleChangeSpecsName = (event, specsId, id) => {
    const tempSpecs = specss[specsId];
    const tempSpecsDetails = { ...tempSpecs.details[id] };
    tempSpecsDetails.value = event.target.value;
    const newState = [...specss];
    newState[specsId].details[id] = tempSpecsDetails;
    setSpecs(newState);
  };

  const handleChangeSpecsLabel = (event, specsId, id) => {
    const tempSpecs = specss[specsId];
    const tempSpecsDetails = { ...tempSpecs.details[id] };
    tempSpecsDetails.label = event.target.value;
    const newState = [...specss];
    newState[specsId].details[id] = tempSpecsDetails;
    setSpecs(newState);
  };
  const descriptionHandler = (event, editor) => {
    const data = editor.getData();
    setDescription(data);
  };

  const handleChangePicture = (event) => {
    setImageServer(null)
    if (checkType(event)) {
      setFile(event.target.files[0]);
      const preview = URL.createObjectURL(event.target.files[0]);
      setImage(preview);
    }
  };
  return (
    loading ? <center><Spinner /></center> :
      <div className="animated fadeIn">
        <ToastContainer />
        <Card>
          <CardHeader>
            <h6>اضافه کردن محصول </h6>
          </CardHeader>
          <CardBody>
            <FormGroup row className="my-0">
              <Row>
                <Col xs="10">
                  <FormGroup>
                    <label htmlFor="title">نام </label>
                    <Input
                      type="text"
                      value={fname}
                      onChange={(event) => setFname(event.target.value)}
                      id="title"
                      placeholder="نام محصول را وارد کنید"
                      required
                    />
                  </FormGroup>
                </Col>{" "}
                <Col xs="10">
                  <FormGroup>
                    <label htmlFor="title">نام انگلیسی </label>
                    <Input
                      type="text"
                      value={ename}
                      onChange={(event) => setEname(event.target.value)}
                      id="title"
                      placeholder="نام انگلیسی محصول را وارد کنید"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs="3">
                  <FormGroup>
                    <label htmlFor="label">دسته اصلی</label>
                    <Input
                      type="select"
                      id="mainCategory"
                      value={catId}
                      // onChange={categoryHandler}
                      required
                      disabled
                    >
                      <option>{categoryName}</option>

                    </Input>
                  </FormGroup>
                </Col>
                <Col xs="3">
                  <FormGroup>
                    <label htmlFor="label">زیر دسته</label>
                    <Input
                      type="select"
                      id="subCategory"
                      value={subCatId}
                      // onChange={subCategoryHandler}
                      required
                      disabled
                    >
                      <option>{subCategoryName}</option>

                    </Input>
                  </FormGroup>
                </Col>
                <Col xs="3">
                  <FormGroup>
                    <label htmlFor="label">زیر دسته دوم</label>
                    <Input
                      type="select"
                      id="thirdCategory"
                      value={thirdSubCatId}
                      // onChange={thirdSubCatHandler}
                      required
                      disabled
                    >
                      <option>{thirdCategoryName}</option>

                    </Input>
                  </FormGroup>
                </Col>
                <Col xs="3">
                  <FormGroup>
                    <label htmlFor="label">برند</label>
                    <Input
                      type="text"
                      id="brands"
                      value={brandName}
                      disabled
                    />

                  </FormGroup>
                </Col>
              </Row>
              <hr style={{ marginTop: "20px" }} />

              <Row>
                {info.map((item, index) => {
                  // let nameSeller = getNameSeller(item.seller);
                  // let nameWarranty = getNameWarranty(item.warranty);

                  return (
                    <Row key={index}>
                      <Col xs="2">
                        <FormGroup>
                          <label htmlFor="label">فروشنده</label>
                          <Input
                            type="text"
                            id="seller"
                            value={item.seller.name}
                            disabled
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="2">
                        <FormGroup>
                          <label htmlFor="label">گارانتی</label>
                          <Input
                            type="text"
                            id="seller"
                            value={item.warranty.name}
                            disabled
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="1">
                        <FormGroup>
                          <label htmlFor="label">رنگ</label>
                          <div
                            className="colorBox"
                            style={{ background: item.color }}
                          ></div>
                        </FormGroup>
                      </Col>
                      <Col xs="2">
                        <FormGroup>
                          <label htmlFor="label">تعداد</label>
                          <Input
                            type="text"
                            id="count"
                            value={item.stock}
                            disabled
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="2">
                        <FormGroup>
                          <label htmlFor="label">قیمت</label>
                          <Input
                            type="text"
                            id="price"
                            value={item.price}
                            disabled
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="2">
                        <FormGroup>
                          <label htmlFor="label">درصد تخفیف</label>
                          <Input
                            type="text"
                            id="count"
                            value={item.discount}
                            disabled
                            required
                          />
                        </FormGroup>
                      </Col>

                    </Row>
                  );
                })}
              </Row>

              <hr />

              {specss != undefined
                ? specss.map((spec, index) => {
                  return (
                    <Card key={spec._id}>
                      <CardHeader>{spec.specs}</CardHeader>
                      <CardBody>
                        {spec.details.map((item, idx) => {
                          const Id = `name-${item._id}`;
                          const LabelId = `label-${item._id}`;
                          return (
                            <Row key={item._id}>
                              <Col xs="4">
                                <FormGroup>
                                  <Input
                                    type="text"
                                    value={item.name}
                                    disabled
                                  />
                                </FormGroup>
                              </Col>
                              <Col xs="4">
                                <FormGroup>
                                  <Input
                                    type="text"
                                    id={Id}
                                    name={Id}
                                    value={item.value}
                                    onChange={(event) =>
                                      handleChangeSpecsName(event, index, idx)
                                    }
                                    required
                                  />
                                </FormGroup>
                              </Col>
                              <Col xs="4">
                                <FormGroup>
                                  <Input
                                    type="text"
                                    id={Id}
                                    name={Id}
                                    onChange={(event) =>
                                      handleChangeSpecsLabel(event, index, idx)
                                    }
                                    value={item.label}
                                    placeholder="توضیحات درصورت نیاز"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          );
                        })}
                      </CardBody>
                    </Card>
                  );
                })
                : null}

              <Row>
                <PejmanCKEditor
                  title={"توضیحات"}
                  data={description}
                  onChange={descriptionHandler}
                />
              </Row>
              <Row>

                <InsertImage onChange={handleChangePicture} imageServer={imageServer} image={image} />


              </Row>
            </FormGroup>
          </CardBody>
          <CardFooter className="footer">
            <CRow>
              <CButton type="submit" color="primary" onClick={handleSubmit}>
                <strong>ویرایش</strong>
              </CButton>
            </CRow>
          </CardFooter>
        </Card>

      </div>
  );
};

export default EditProduct;
