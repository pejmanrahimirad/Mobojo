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
import "./style.css";
import CIcon from "@coreui/icons-react";
import { cibAddthis, cilTrash } from "@coreui/icons";
const AddProduct = (props) => {
  const [fname, setFname] = useState("");
  const [ename, setEname] = useState("");
  const [mainCat, setMainCat] = useState(true);
  const [parentCat, setParentCat] = useState(false);
  const [catId, setCatId] = useState(null);
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
  const [spces,setSpecs]=useState([])
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
  const categoryHandler = (event) => {
    setParentCat(true);
    setMainCat(false);
    setCatId(event.target.value);

    axios({
      url: "/",
      method: "post",
      data: {
        query: `query GetAddProductInfo($categoryId: ID, $subCategory: ID, $getSubCategory: Boolean) {
          getAddProductInfo(categoryId: $categoryId, subCategory: $subCategory, getSubCategory: $getSubCategory) {
            sellers {
              _id
              name
            }
          }
        }`,
        variables: {
          categoryId: event.target.value,
          subCategory: null,
          getSubCategory: false,
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        const { sellers } = res.data.data.getAddProductInfo;
        setSellers(sellers);
      } else {
        toast.error(res.data.errors[0].message);
        setSellers([]);
      }
    });
  };
  const subCategoryHandler = (event) => {
    setsubCatId(event.target.value);
    axios({
      url: "/",
      method: "post",
      data: {
        query: `query GetAddProductInfo($categoryId: ID, $subCategory: ID, $getSubCategory: Boolean) {
          getAddProductInfo(categoryId: $categoryId, subCategory: $subCategory, getSubCategory: $getSubCategory) {
            brands {
              _id
              name
              image
            }
            specs {
              _id
              specs
              label
              details {
                _id
                name
                label
              }
            }
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
        setBrands(brands);
        setThirdSubCat(subCate);

        for (let i = 0; i < specs.length; i++) {
          const element = specs[i];
          for (let j = 0; j < element.details.length; j++) {
            const item = element.details[j];
            specs[i].details[j].value = "";
            specs[i].details[j].label= "";
          }
        }
        console.log(specs);
      } else {
        toast.error(res.data.errors[0].message);
        setBrands([]);
        setThirdSubCat([]);
      }
    });
  };
  const thirdSubCatHandler = (event) => {
    setThirdSubCatId(event.target.value);
  };
  const brandHandler = (event) => {
    setBrandId(event.target.value);
  };
  const addInfo = () => {
    const arrayHolder = [...info];
    const newObj = {
      seller: sellerId,
      warranty: warrantyId,
      price: parseInt(price),
      stock: parseInt(count),
      discount: parseInt(discountPrice),
      color: color,
    };
    const exist = arrayHolder.find((item) => {
      return JSON.stringify(item) == JSON.stringify(newObj);
    });
    if (JSON.stringify(exist) != JSON.stringify(newObj))
      setInfo([...info, newObj]);
    else {
      alert("نمیتوان دو بار یک مشخصات را وارد کرد");
    }
  };
  const deleteItemInfo = (item) => {
    const infoItem = info.filter((x) => x != item);

    setInfo(infoItem);
  };
  const getNameSeller = (id) => {
    const name = sellers.filter((item) => {
      return item._id == id;
    });
    return name[0].name;
  };
  const getNameWarranty = (id) => {
    const name = warranty.filter((item) => {
      return item._id == id;
    });
    return name[0].name;
  };
  const handleSubmit = () => {
    // axios({
    //   url: "/",
    //   method: "post",
    //   data: {
    //     query: `mutation Warranty($input: InputWarranty) {
    //         warranty(input: $input) {
    //           status
    //           message
    //         }
    //       }`,
    //     variables: {
    //       input: {
    //         name: title,
    //         label: label,
    //       },
    //     },
    //   },
    // }).then((res) => {
    //   console.log(res);
    //   if (res.data.data != null) {
    //     toast.success("گارانتی اضافه شد");
    //     setTitle("");
    //     setLabel("");
    //   } else {
    //     toast.error(res.data.errors[0].message);
    //   }
    // });
  };

  return (
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
              <Col xs="3">
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
              <Col xs="3">
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
              <Col xs="3">
                <FormGroup>
                  <label htmlFor="label">برند</label>
                  <Input
                    type="select"
                    id="brands"
                    value={brandId}
                    onChange={brandHandler}
                    required
                  >
                    <option>انتخاب کنید</option>
                    {brands != null
                      ? brands.map((item, index) => (
                          <option key={index} value={item._id}>
                            {item.name}
                          </option>
                        ))
                      : null}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <hr style={{ marginTop: "20px" }} />
            <Row>
              <Col xs="4">
                <FormGroup>
                  <label htmlFor="label">فروشنده</label>
                  <Input
                    type="select"
                    id="sellers"
                    value={sellerId}
                    onChange={(event) => setSellerId(event.target.value)}
                    required
                  >
                    <option>انتخاب کنید</option>
                    {sellers != undefined
                      ? sellers.map((item, index) => (
                          <option key={index} value={item._id}>
                            {item.name}
                          </option>
                        ))
                      : null}
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup>
                  <label htmlFor="label">گارانتی</label>
                  <Input
                    type="select"
                    id="warranty"
                    value={warrantyId}
                    onChange={(event) => setWarrantyId(event.target.value)}
                    required
                  >
                    <option>انتخاب کنید</option>
                    {warranty != undefined
                      ? warranty.map((item, index) => (
                          <option key={index} value={item._id}>
                            {item.name}
                          </option>
                        ))
                      : null}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <hr style={{ marginTop: "20px" }} />
            <Row>
              <Col xs="3">
                <FormGroup>
                  <label htmlFor="label">رنگ</label>
                  <Input
                    type="select"
                    id="Color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    required
                  >
                    <option value="black">مشکی</option>
                    <option value="red">قرمز</option>
                    <option value="blue">آبی</option>
                    <option value="green">سبز</option>
                    <option value="yellow">زرد</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="2">
                <FormGroup>
                  <label htmlFor="label">تعداد</label>
                  <Input
                    type="number"
                    id="count"
                    value={count}
                    onChange={(event) => setCount(event.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <label htmlFor="label">قیمت(تومان)</label>
                  <Input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
              <Col xs="2">
                <FormGroup>
                  <label htmlFor="label">درصد تخفیف</label>
                  <Input
                    type="number"
                    id="priceOff"
                    value={discountPrice}
                    onChange={(event) => setDiscountPrice(event.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
              <Col xs="2" className="addButton">
                <br />
                <CIcon
                  icon={cibAddthis}
                  color="success"
                  size="xxl"
                  onClick={addInfo}
                />
              </Col>
            </Row>
            <Row>
              {info.map((item, index) => {
                let nameSeller = getNameSeller(item.seller);
                let nameWarranty = getNameWarranty(item.warranty);

                return (
                  <Row key={index}>
                    <Col xs="2">
                      <FormGroup>
                        <label htmlFor="label">فروشنده</label>
                        <Input
                          type="text"
                          id="seller"
                          value={nameSeller}
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
                          value={nameWarranty}
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
                    <Col xs="1" className="addButton">
                      <br />
                      <CIcon
                        icon={cilTrash}
                        color="success"
                        className="trash"
                        size="xxl"
                        onClick={() => deleteItemInfo(item)}
                      />
                    </Col>
                  </Row>
                );
              })}
            </Row>
          </FormGroup>
        </CardBody>
        <CardFooter className="footer">
          <CRow>
            <CButton type="submit" color="primary" onClick={handleSubmit}>
              <strong>ثبت</strong>
            </CButton>
          </CRow>
        </CardFooter>
      </Card>

      {/* <CCol xs={12}>
        <hr />
        <CTable>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">عنوان</CTableHeaderCell>
              <CTableHeaderCell scope="col">توضیحات</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {allWarranty != undefined
              ? allWarranty.map((item) => {
                  return (
                    <CTableRow key={item._id}>
                      <CTableDataCell>{item.name}</CTableDataCell>
                      <CTableDataCell>{item.label}</CTableDataCell>
                    </CTableRow>
                  );
                })
              : null}
          </CTableBody>
        </CTable>
      </CCol> */}
    </div>
  );
};

export default AddProduct;
