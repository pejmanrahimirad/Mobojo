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
    Button,
    FormGroup,
    Label,
    ModalFooter,
} from "reactstrap";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CButton } from "@coreui/react";
import './style.css'

const ChangeStatus = (props) => {
    const { modal, toggleLarge,setStatus,updateStatus } = props;

    const [orderStatus, setOrderStatus] = useState(true);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        axios({
            url: '/',
            method: 'POST',
            data: {
                query: `query AllOrderStatus {
            AllOrderStatus {
                _id
              count
              default
              order
              image
            }
          }`}
        }).then((res) => {
            if (res.data.data != null) {
                const { AllOrderStatus } = res.data.data;
                console.log(AllOrderStatus)
                setOrderStatus(AllOrderStatus)
                setLoading(true)
            }
        })
    }, [])

    const changeStatusHandler = (event, name) => {
        const status={
            id:event.target.value,
            name:name
        }
        setStatus(status)
    }
 
    return (
        <div className="animated fadeIn">
            <ToastContainer />
            <Card>
                <Modal isOpen={modal} toggle={toggleLarge} className={"modal-lg "}>
                    <ModalHeader toggle={toggleLarge}>
                        <Row>

                            <Col md="12">
                                تغییر وضعیت سفارش 
                            </Col>
                        </Row>
                    </ModalHeader>
                    <ModalBody>
                        {(loading)? orderStatus.map((item) => {
                            let id = `radio-${item._id}`
                            return (<Row key={id} className="change-order-status-list">
                              
                                    <FormGroup>
                                        <Input type="radio"
                                            id={id}
                                            name="select"
                                            value={item._id}
                                            onChange={(e) => changeStatusHandler(event, item.order)} />
                                        <Label htmlFor={id} >{item.order}</Label>
                                    </FormGroup>
                              
                            </Row>)
                        }):null}
                    </ModalBody>
                    <ModalFooter>
                        <CButton color="danger" onClick={updateStatus}>ویرایش</CButton>
                    </ModalFooter>
                </Modal>
            </Card>
        </div>
    );
};

export default ChangeStatus;
