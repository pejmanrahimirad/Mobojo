import React, { useContext, useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Input,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    FormGroup,
    Label,
    ModalFooter,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cibZapier, cilStar, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CRow } from "@coreui/react";
const AddSeller = (props) => {
    const [loading, setLoading] = useState(true);
    const { modal,
        toggle,
        productName,
        categoryHandler,
        allCategory,
        sellers,
        sellerHandler,
        allWarranty,
        warrantyHandler,
        colorHandler,
        numberOfProduct,
        numberOfProductHandler,
        price,
        priceHandler,
        discount,
        discountHandler,
        addSellerToProduct
    } = props;
    console.log(allCategory)
    return (
        <div className="animated fadeIn">
            <ToastContainer />
            <Card>
                <Modal isOpen={modal} toggle={toggle} className={"modal-lg "}>
                    <ModalHeader toggle={toggle}>
                        <Row>
                            اضافه کردن فروشنده به محصول {productName}
                        </Row>
                    </ModalHeader>
                    <ModalBody>
                        <CRow>
                            <Col xl="3">
                                <FormGroup className="my-0">
                                    <label htmlFor="cat">دسته اصلی</label>
                                    <Input
                                        id="cat"
                                        type="select"
                                        onChange={categoryHandler}
                                    >
                                        <option></option>
                                        {
                                            allCategory.map((item) => {
                                                return <option key={item._id} value={item._id}>
                                                    {item.name}
                                                </option>
                                            })
                                        }
                                    </Input>

                                </FormGroup>
                            </Col>
                            <Col xl="4">
                                <FormGroup className="my-0">
                                    <label htmlFor="cat">فروشنده</label>
                                    <Input
                                        id="cat"
                                        type="select"
                                        onChange={sellerHandler}
                                    >
                                        <option></option>
                                        {sellers ?
                                            sellers.map((item) => {
                                                return <option key={item._id} value={item._id}>
                                                    {item.name}
                                                </option>
                                            }) : null
                                        }
                                    </Input>

                                </FormGroup>
                            </Col>
                            <Col xl="4">
                                <FormGroup className="my-0">
                                    <label htmlFor="warranty">فروشنده</label>
                                    <Input
                                        id="warranty"
                                        type="select"
                                        onChange={warrantyHandler}
                                    >
                                        <option></option>
                                        {sellers ?
                                            allWarranty.map((item) => {
                                                return <option key={item._id} value={item._id}>
                                                    {item.name}
                                                </option>
                                            }) : null
                                        }
                                    </Input>

                                </FormGroup>
                            </Col>
                            <Col xs="4">
                                <FormGroup>
                                    <Col md="4">
                                        <Label>رنگ</Label>
                                    </Col>
                                    <Col md="8">
                                        <Input
                                            type="select"
                                            // value={item.color}
                                            onChange={colorHandler}
                                        >
                                            <option value={'Black'}>مشکی</option>
                                            <option value={'red'}>قرمز</option>
                                            <option value={'blue'}>آبی</option>
                                            <option value={'green'}>سبز</option>
                                            <option value={'yellow'}>زرد</option>
                                        </Input>
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col xs="2">

                                <FormGroup>
                                    <Col md="4">
                                        <Label>تعداد</Label>
                                    </Col>
                                    <Col md="8">
                                        <Input
                                            type="number"
                                            value={numberOfProduct}
                                            required
                                            onChange={numberOfProductHandler}

                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col xs="3">
                                <FormGroup>
                                    <Col md="4">
                                        <Label>قیمت(تومان)</Label>
                                    </Col>
                                    <Col md="8">
                                        <Input
                                            type="number"
                                            value={price}
                                            required
                                            onChange={priceHandler}

                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col xs="3">
                                <FormGroup>
                                    <Col md="4">
                                        <Label>تخفیف</Label>
                                    </Col>
                                    <Col md="8">
                                        <Input
                                            type="number"
                                            value={discount}
                                            required
                                            onChange={discountHandler}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </CRow>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={addSellerToProduct}  >ثبت</Button>
                        <Button color="secondary" onClick={toggle} >لغو</Button>
                    </ModalFooter>
                </Modal>
            </Card>
        </div>
    );
};

export default AddSeller;
