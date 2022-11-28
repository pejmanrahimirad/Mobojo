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
} from "reactstrap";
import axios from "axios";
import "./media.css";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllMedia = (props) => {
  const [allMedia, setAllMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [arrayHolder, setArrayHolder] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modal, setModal] = useState(false);
  const [backdrop, setBackdrop] = useState(true);
  const [keyboard, setKeyboard] = useState(true);

  useEffect(() => {
    function fetchData() {
      axios({
        url: "/",
        method: "post",
        data: {
          query: `query GetAllMultimedia($page: Int, $limit: Int) {
                 getAllMultimedia(page: $page, limit: $limit) {
                 _id
                 name
                 dir
                 }
             }`,
          variables: {
            page: 1,
            limit: 30,
          },
        },
      })
        .then((response) => {
          if (response.data.errors) {
            const { message } = response.data.errors[0];
            toast.error(message);
          } else {
            const { getAllMultimedia } = response.data.data;
            console.log(getAllMultimedia);
            setAllMedia(getAllMultimedia);
            setArrayHolder(getAllMultimedia);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log("error is: ", error);
        });
    }
    fetchData();
  }, []);

  const filterMedia = () => {
    setSearchBarValue(event.target.value);
    const newData = arrayHolder.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = event.target.value.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setAllMedia(newData);
  };

  const toggle = () => setModal(!modal);

  const changeBackdrop = (e) => {
    let { value } = e.target;
    if (value !== "static") {
      value = JSON.parse(value);
    }
    setBackdrop(value);
  };

  const setChangeModal = (item) => {
    console.log(item);
    setModal(true);
    setSelectedItem(item);
  };
  return (
    <div className="animated fadeIn">
      <ToastContainer />
      <Card>
        <CardHeader>
          <h6>کتابخانه پرونده چند رسانه ای</h6>
          <Col xs="7">
            <Input
              type="text"
              placeholder="جستجو در پرونده ها"
              value={searchBarValue}
              onChange={filterMedia}
            />
          </Col>
        </CardHeader>
        <CardBody>
          <div className="mediaSection">
            {loading ? (
              <Spinner />
            ) : (
              allMedia.map((item) => {
                return (
                  <div
                    className="media"
                    key={item._id}
                    onClick={() => setChangeModal(item)}
                  >
                    <img
                      src={`${process.env.REACT_APP_PUBLIC_URL}${item.dir}`}
                      alt={item.name}
                    />
                  </div>
                );
              })
            )}
          </div>
        </CardBody>
      </Card>
      {selectedItem ? (
        <Modal
          isOpen={modal}
          toggle={toggle}
          className={'modal-lg '}
        >
          <ModalHeader toggle={toggle}>اطلاعات پرونده</ModalHeader>
          <ModalBody>
        <Row>
            <Col xs="8">
              <img style={{height:300,width:300}} src={`${process.env.REACT_APP_PUBLIC_URL}${selectedItem.dir}`}
                      alt={selectedItem.name} />
            </Col>
            <Col xs="4">
              <Row>
                <Col xs="6"> نام :</Col>
                <Col xs="6">{selectedItem.name}</Col>
                <Col xs="6"> فرمت :</Col>
                <Col xs="6">{selectedItem.format}</Col>
                <Col xs="6"> ابعاد :</Col>
                <Col xs="6">{selectedItem.dimwidth}</Col>
              </Row>
            </Col>
        </Row>
          </ModalBody>
        </Modal>
      ) : null}
    </div>
  );
};

export default AllMedia;
