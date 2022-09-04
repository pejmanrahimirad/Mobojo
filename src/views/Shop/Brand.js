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
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import GetToken from "src/context/auth/GetToken";
const token = GetToken();
const Brand = (props) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [categoryFromServer, setCategoryFromServer] = useState([]);
  const [categoryValue, setCategoryValue] = useState("");
  const [subCategoryFromServer, setSubCategoryFromServer] = useState([]);
  const [arrayHolder, setArrayHolder] = useState([]);
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [brands, setBrands] = useState([]);
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
            page: 1,
            limit: 30,
            mainCategory: true,
            parentCategory: false,
            catId: null,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        const { getAllCategory } = res.data.data;
        setCategoryFromServer(getAllCategory);

        // toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });

    axios({
      url: "/",
      method: "post",
      data: {
        query: `query Query($input: InputGetBrand!) {
          getAllBrand(input: $input) {
            _id
            name
            label
            image
            category {
              _id
              name
              image {
                dir
                name
                _id
              }
            }
          }
        }`,
        variables: {
          input: {
            page: null,
            limit: null,
            cateogry: null,
            getAll: true,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        const { getAllBrand } = res.data.data;
        setBrands(getAllBrand);
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  }, []);

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleDesc = (evnet) => {
    setDesc(event.target.value);
  };
  const handleCategory = (event) => {
    setCategoryValue(event.target.value);
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
            page: 1,
            limit: 30,
            mainCategory: false,
            parentCategory: true,
            catId: event.target.value,
          },
        },
      },
    }).then((res) => {
      if (res.data.data != null) {
        console.log(res);
        const { getAllCategory } = res.data.data;
        setSubCategoryFromServer(getAllCategory);

        // toast.success("دسته بندی ها دریافت شد");
      } else {
        toast.error(res.data.errors[0].message);
      }
    });
  };
  const addsubCategory = (event) => {
    const category = subCategoryFromServer.filter((subCategory) => {
      return subCategory._id == event.target.value;
    })[0];
    if (!arrayHolder.includes(category))
      setArrayHolder([...arrayHolder, category]);
  };

  const removeSubCategory = (item) => {
    const newArray = arrayHolder.filter((i) => i != item);
    setArrayHolder(newArray);
  };

  const handleChangeFile = (event) => {
    setFile(event.target.files[0]);
    const preview = URL.createObjectURL(event.target.files[0]);
    setImage(preview);
  };
  const handleSubmit = () => {
    const newArray = [];
    for (let index = 0; index < arrayHolder.length; index++) {
      const element = arrayHolder[index];
      newArray.push(element._id);
    }
    let data = {
      query: `mutation Mutation($input: InputBrand) {
        brand(input: $input) {
          status
          message
        }
      }
      `,
      variables: {
        input: {
          name: title,
          label: desc,
          image: null,
          category: newArray,
        },
      },
    };

    let map = {
      0: ["variables.input.image"],
    };
    const FormD = new FormData();
    FormD.append("operations", JSON.stringify(data));
    FormD.append("map", JSON.stringify(map));
    FormD.append(0, file, file.name);
    let options = {
      method: "POST",
      headers: {
        token: `${token}`,
      },
      body: FormD,
    };
    let url = `http://localhost:4000/graphql`;
    fetch(url, options)
      .then((res) => res.json())
      .then((responese) => {
        const { status } = responese.data.brand;
        if (status == 200) {
          toast.success("برند با موفقیت ثبت شد");
        } else {
          toast.error("ثبت برند با مشکل روبه رو شد");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="animated fadeIn">
      <ToastContainer />
      <Card>
        <CardHeader>
          <h6>اضافه کردن برند</h6>
        </CardHeader>
        <CardBody>
          <FormGroup row className="my-0">
            <Col xs="6">
              <Label htmlFor="title">عنوان</Label>
              <Input
                type={"text"}
                required
                id={"title"}
                value={title}
                onChange={handleTitle}
                placeholder=" عنوان برند را وارد کنید"
              />
            </Col>
            <Col xs="6">
              <Label htmlFor="description">توضیحات</Label>
              <Input
                type={"text"}
                id={"description"}
                value={desc}
                onChange={handleDesc}
                placeholder=" توضیحات برند را وارد کنید"
              />
            </Col>
            <Col xs="6">
              <label htmlFor="mainSubTitle">دسته اصلی</label>
              <Input
                type="select"
                name="mainSubTitle"
                value={categoryValue}
                onChange={handleCategory}
                id="mainSubTitle"
              >
                <option>یک دسته بندی را انتخاب کنید</option>
                {categoryFromServer.map((item) => {
                  return (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </Input>
            </Col>
            <Col xs="6">
              <label htmlFor="mainSubTitle">دسته دوم</label>
              <Input
                type="select"
                name="mainSubTitle"
                id="mainSubTitle"
                multiple
                value={subCategoryFromServer}
                onChange={addsubCategory}
              >
                {subCategoryFromServer.map((item) => {
                  return (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </Input>
            </Col>
            <Col xs="6" className="brandSection">
              {arrayHolder.map((item) => {
                return (
                  <Col className="brand" xs="3" key={item._id}>
                    <i
                      className="fa fa-remove fa-lg remove-item"
                      onClick={() => removeSubCategory(item)}
                    >
                      x
                    </i>
                    <span>{item.name}</span>
                  </Col>
                );
              })}
            </Col>
            <Col xs="6" className="selectFile">
              <FormGroup row>
                <label htmlFor="file-multiple-input" className="file-dashed">
                  <div className="fileSelection">گزینش پرونده</div>
                </label>
                <Input
                  type="file"
                  id="file-multiple-input"
                  name="file-multiple-input"
                  multiple
                  onChange={handleChangeFile}
                />
              </FormGroup>
            </Col>

            {image ? (
              <Col xs="12" className="showImage">
                <img src={image} alt={image} className="previewImage" />
              </Col>
            ) : null}
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

      <CCol xs={12}>
        <hr />
        <CTable>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">نام برند</CTableHeaderCell>
              <CTableHeaderCell scope="col">دسته های مرتبط</CTableHeaderCell>
              <CTableHeaderCell scope="col">تصویر</CTableHeaderCell>
              <CTableHeaderCell scope="col">توضیحات</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {brands.map((item) => {
              return (
                <CTableRow key={item._id}>
                  <CTableDataCell>{item.name}</CTableDataCell>
                  <CTableDataCell>
                    {item.category.map((subCat) => {
                      return <p key={subCat._id}>{subCat.name}</p>;
                    })}
                  </CTableDataCell>
                  <CTableDataCell>
                    <img
                      src={`${process.env.REACT_APP_PUBLIC_URL}${item.image}`}
                      alt={item.name}
                      style={{ height: "64px", width: "64px" }}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{item.label}</CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
      </CCol>
    </div>
  );
};

export default Brand;
