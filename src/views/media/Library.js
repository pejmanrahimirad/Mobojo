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
} from "reactstrap";
import axios from "axios";
import "./media.css";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Library = (props) => {
  const [allMedia, setAllMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [arrayHolder, setArrayHolder] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

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
            const customLibrary = getAllMultimedia.map((item) => {
              return { ...item, check: false };
            });
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
  const { modal,  toggleLarge, setModal ,insertImage ,addImage,multi} = props;
  return (
    <div className="animated fadeIn">
      <ToastContainer />
      <Card>
        <Modal isOpen={modal} toggle={toggleLarge} className={"modal-lg "}>
          <ModalHeader  toggle={toggleLarge}>
            <Row>
            
              <Col xs="10">
                <Input
                  type="text"
                  placeholder="جستجو "
                  value={searchBarValue}
                  onChange={filterMedia}
                />
              </Col>
            </Row>
          </ModalHeader>
          <ModalBody>
            <div className="mediaSection">
              {loading ? (
                <Spinner />
              ) : (
                allMedia.map((item) => {
                  return (
                    <div
                      className="media"
                      key={item._id}
                    >
                      <Input
                        name={`${item._id}`}
                        id={`${item._id}`}
                        type="checkbox"
                        style={{ position: "absolute" }}
                        checked={item.check}
                        onChange={() => addImage(item)}
                      />
                      <label htmlFor={`${item._id}`} style={{margin:'0px',padding:'0px'}}>
                        <img
                          style={{ width: "100%",margin:0 }}
                          src={`${process.env.REACT_APP_PUBLIC_URL}${item.dir}`}
                          alt={item.name}
                        />
                      </label>
                    </div>
                  );
                })
              )}
            </div>
            {
              multi?
              <Button size="md" color="primary" onClick={insertImage} >افزودن</Button>:null
            }
          </ModalBody>
        </Modal>
      </Card>
    </div>
  );
};

export default Library;
