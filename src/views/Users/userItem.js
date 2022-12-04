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
import { Link } from "react-router-dom";


const UserItem = (props) => {
    const [loading, setLoading] = useState(true);
    const { allUsers } = props;

    return (
        allUsers.map((item) => {
            const userLink = `/users/userinfo/${item._id}`
            return (<CTableBody key={item._id}>
            
                <CTableDataCell>
                    <Link to={userLink} >
                        {item.phone}
                    </Link>
                </CTableDataCell>
                <CTableDataCell>
                    {item.fname} {item.lname}
                </CTableDataCell>
                <CTableDataCell>
                    {item.postCode ? item.postCode : "********"}
                </CTableDataCell>
                <CTableDataCell>
                    {item.email ? item.status : "********"}

                </CTableDataCell>
                <CTableDataCell>
                    <Link to={userLink} >
                        <Badge color={item.active ? "success" : "danger"}>
                            {item.active ? "تایید شده" : "رد شده"}
                        </Badge>
                    </Link>
                </CTableDataCell>




            </CTableBody>)
        })
    );
};

export default UserItem;




