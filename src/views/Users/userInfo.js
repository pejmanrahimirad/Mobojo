import React, { useContext, useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Input,
    Spinner,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    FormGroup,
    Label,
    Badge,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CButton, CTableBody, CTableDataCell } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cibShopify, cilBug, cilCommentBubble, cilHeart, cilTrash } from "@coreui/icons";
import { Link ,useParams} from "react-router-dom";

const UserInfo = (props) => {
    const [loading, setLoading] = useState(true);
    const [user,setUser]=useState(null)
    let params=useParams()
    useEffect(()=>{
    const {id }=params;
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
                "userId": id
            },
        },
    }).then((res) => {
        if (res.data.data != null) {
            const { getAllUsers } = res.data.data
            console.log(getAllUsers[0])
            setUser(getAllUsers[0])
        } else {
            toast.error(res.data.errors[0].message);
        }
    })

    },[])
    return (
        <div className="animated fadeIn">
            <Row>
                <Col lg="12">
                    {user?
                    <Card>
                        <CardBody>
                            <Row>
                                <Col>نام</Col>
                                <Col>{user.fname}</Col>
                                <Col>نام خانوادگی</Col>
                                <Col>{user.lname}</Col>
                            </Row>
                        </CardBody>
                        <CardBody>
                            <Row>
                                <Col>شماره تماس</Col>
                                <Col>{user.phone}</Col>
                                <Col>آدرس</Col>
                                <Col>{user.address}</Col>
                            </Row>
                        </CardBody>
                    </Card>
                :null}
                </Col>
            </Row>
        </div>
    );
};

export default UserInfo;




