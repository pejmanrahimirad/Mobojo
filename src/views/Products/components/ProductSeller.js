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
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cibZapier, cilStar, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
const ProductSeller = (props) => {
    const [loading, setLoading] = useState(true);
    const { modal,
        toggle,
        attribute,
        productName,
        handleChangeColor,
        handleChangeStock,
        handleChangePrice,
        handleChangeDiscount,
        handleSuggestion } = props;
    return (
        <div className="animated fadeIn">
            <ToastContainer />
            <Card>
                <Modal isOpen={modal} toggle={toggle} className={"modal-lg "}>
                    <ModalHeader toggle={toggle}>
                        <Row>
                            فروشندگان {productName}
                        </Row>
                    </ModalHeader>
                    <ModalBody>
                        <div className="mediaSection">

                            {attribute.map((item, index) => {
                                return (
                                    <Row key={item.seller._id}>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Col md="4">
                                                    <Label>فروشنده</Label>
                                                </Col>
                                                <Col md="8">
                                                    <Input
                                                        type="text"
                                                        name="disabled-input"
                                                        disabled
                                                        placeholder={item.seller.name}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Col md="4">
                                                    <Label>گارانتی</Label>
                                                </Col>
                                                <Col md="8">
                                                    <Input
                                                        type="text"
                                                        name="disabled-input"
                                                        disabled
                                                        placeholder={item.warranty.name}
                                                    />
                                                </Col>
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
                                                        value={item.color}
                                                        onChange={(event) => handleChangeColor(event, index)}
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
                                                        value={item.stock}
                                                        required
                                                        onChange={(event) => handleChangeStock(event, index)}

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
                                                        value={item.price}
                                                        required
                                                        onChange={(event) => handleChangePrice(event, index)}

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
                                                        value={item.discount}
                                                        required
                                                        onChange={(event) => handleChangeDiscount(event, index)}

                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Col md="6">
                                                    <Label>پیشنهاد ویژه</Label>
                                                </Col>
                                                <Col md="6" style={{ cursor: 'pointer' }}>
                                                    {(item.suggestion) ?
                                                        <CIcon
                                                            style={{ color: 'yellow' }}
                                                            icon={cibZapier}
                                                            size="xxl"
                                                            onClick={() => handleSuggestion(index, false)}
                                                        /> :
                                                        <CIcon
                                                            style={{ color: 'gray' }}
                                                            icon={cibZapier}
                                                            size="xxl"
                                                            onClick={() => handleSuggestion(index, true)}
                                                        />}
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="1">
                                            <FormGroup>
                                                <Col md="6">
                                                    <Label></Label>
                                                </Col>
                                                <Col md="6" style={{ cursor: 'pointer' }}>

                                                    <CIcon
                                                        style={{ color: 'red', borderRadius: 5, padding: 4, background: '#fca' }}
                                                        icon={cilTrash}
                                                        size="xxl"
                                                        onClick={() => handleSuggestion(index, false)}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <div style={{ background: "#ccc", height: 1, marginBottom: 15 }} ></div>
                                    </Row>
                                )
                            })}
                        </div>
                    </ModalBody>
                </Modal>
            </Card>
        </div>
    );
};

export default ProductSeller;
