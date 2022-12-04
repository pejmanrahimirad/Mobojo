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
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import UserItem from "./userItem";
import CIcon from "@coreui/icons-react";
import { cilPlus, cibAddthis, cilImage, cilPen, cilTrash, cilScreenDesktop } from "@coreui/icons";

const Users = (props) => {
    const [reload, setReload] = useState(false)
    const [allUsers, setAllUser] = useState([])
    useEffect(() => {
        axios({
            url: "/",
            method: "post",
            data: {
                query: `query{
                    getAllUsers {
                      _id
                      address
                      fname
                      lname
                      phone
                      comment {
                        _id
                        title
                      }
                      favorites {
                        product {
                          _id
                          ename
                        }
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
                const { getAllUsers } = res.data.data
                setAllUser(getAllUsers)
            } else {
                toast.error(res.data.errors[0].message);
            }
        })

    }, [reload])
    return (<div className="animated fadeIn">
        <ToastContainer />
        <Card>
            <CardHeader>
                <h6>لیست کاربران </h6>
            </CardHeader>
            <CardBody>
                <CTable>
                    <CTableHead color="dark">
                        <CTableRow>
                            <CTableHeaderCell scope="col">شماره تماس</CTableHeaderCell>
                            <CTableHeaderCell scope="col">نام</CTableHeaderCell>
                            <CTableHeaderCell scope="col">کد پستی</CTableHeaderCell>
                            <CTableHeaderCell scope="col">ایمیل</CTableHeaderCell>
                            <CTableHeaderCell scope="col">وضعیت</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>

                    <UserItem allUsers={allUsers} />


                </CTable>
            </CardBody>
        </Card>

    </div>)
}

export default Users;