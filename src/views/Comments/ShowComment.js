import React, { Component, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Spinner, Table, Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';

const ShowComment = (props) => {

    const [comments, setComments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentId, setCommentId] = useState(null)
    let params = useParams()
    useEffect(() => {
        const { id } = params;
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `query($page: Int, $limit: Int, $productId: ID, $commentId: ID){
        getAllComment(page: $page, limit: $limit, productId: $productId, commentId: $commentId) {
          _id
          check
          createdAt
          description
          negative
          positive
          title
          product {
            _id
            fname
          }
          user {
            fname
            phone
          }
        }
      }
      `,
                variables: {
                    "page": 1,
                    "limit": 10,
                    "productId": null,
                    "commentId": id
                }
            }
        }).then((response) => {
            console.log(response)
            if (response.data.errors) {
                toast.error('خطا در دریافت اظهار نظر')
            } else {
                const { getAllComment } = response.data.data;
                setComments(getAllComment[0])
                setLoading(false)
                console.log(loading)
            }
        }).catch((e) => console.log(e))
    }, [])
    const getBadge = (status) => {
        return status ? 'success' : 'danger';

    }
    return (
        <div className="animated fadeIn">
            <Row>
                <Col xl={12}>

                    {
                        // console.log(loading)
                        (comments != null) ?
                            <Card>
                                <CardHeader>
                                    {comments.title}
                                </CardHeader>

                                <CardBody>
                                    <Row>
                                        <Col md="5">
                                            <span> وضعیت :  </span>
                                            <Badge color={getBadge(comments.check)} >
                                                {comments.check ? 'تایید شده' : 'تایید نشده'}
                                            </Badge>
                                        </Col>
                                        <Col md="5">
                                            تاریخ ایجاد :
                                            {
                                                new Date(comments.createdAt).toLocaleDateString('fa-IR')
                                            }
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardBody>
                                    <Row>
                                        <Col md="5">

                                            <p>   <span> توضیحات :  </span>{comments.description}</p>
                                        </Col>
                                        <Col md="5">
                                            شماره تماس ایجاد کننده :
                                            {
                                                comments.user.phone
                                            }
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardBody>
                                    <Row>
                                        <Col md="5">

                                            <p>   <span> نظرات مثبت :  </span>{comments.positive.map((item,index)=>{
                                                return (<p>+ {item}</p>)
                                            })}</p>
                                        </Col>
                                        <Col md="5">
                                        <p>   <span> نظرات منفی :  </span>{comments.negative.map((item,index)=>{
                                                return (<p>- {item}</p>)
                                            })}</p>
                                        </Col>
                                    </Row>
                                </CardBody>
                                  <CardBody>
                                    <Row>
                                        <Col md="5">

                                            <p>   کد محصول :  {comments.product._id}</p>
                                        </Col>
                                        <Col md="5">
                                        <p>   نام محصول :  {comments.product.fname}</p>

                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            : <center>
                                <Spinner />
                            </center>
                    }
                </Col>
            </Row>

        </div>
    )

}

export default ShowComment;
