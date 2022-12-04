import React, { Component, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Row,  Spinner, Table, Badge, Button,Modal,ModalBody,ModalFooter,ModalHeader } from 'reactstrap';
import axios from 'axios';
import {toast} from 'react-toastify';
import {NavLink} from 'react-router-dom'

const AllComments=(props)=> {

const [comments,setComments] = useState([]);
const [loading,setLoading] = useState(false);
const [modal,setModal] = useState(false);
const [commentId,setCommentId] = useState(null)
useEffect(()=>{
  setLoading(true)
  axios({
    url:'/',
    method:'post',
    data:{
      query:`query($page: Int, $limit: Int, $productId: ID, $commentId: ID){
        getAllComment(page: $page, limit: $limit, productId: $productId, commentId: $commentId) {
          _id
          check
          createdAt
          description
          negative
          positive
          product
          title
          user {
            _id
            fname
            lname
          }
        }
      }
      `,
      variables : {
        "page": 1,
        "limit": 10,
        "productId": null,
        "commentId": null
      }
    }
  }).then((response)=>{
   if(response.data.errors){
      toast.error('خطا در دریافت اطلاعات کاربران')
   }else{
    const {getAllComment} = response.data.data;
    console.log(getAllComment)
    setComments(getAllComment)
    setLoading(false)
   }
  }).catch((e)=>console.log(e))
},[])
const getBadge = (status) => {
    return status ? 'success' : 'danger' ;
      
  }
  const toggleLarge = (id)=>{
    
      setModal(!modal)
      setCommentId(id)
  }
  const ChangeStatus = ()=>{
    axios({
        url: '/',
        method: 'post',
        data: {
          query: `mutation UpdateComment($commentId: ID!) {
            updateComment(commentId: $commentId) {
              message
              status
            }
          }    
            `,
            variables :{
              "commentId": commentId
            }
      }
    }).then((response)=>{
        if(response.data.errors){
            toast.error('خطا در تغییر وضعیت نظر')
        }else{
            const newComments = [...comments];
            const index = newComments.findIndex(item=>item._id===commentId);
            newComments[index].check = !newComments[index].check;
            setComments(newComments);
            setModal(false)
        }
    })
  }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
                <CardHeader>
                    نظرات 
                </CardHeader>
            
            <CardBody>
                <Table responsive hover>
                    <thead>
                        <tr>
                            <th scope="col">نام محصول</th>
                            <th scope="col">کاربر</th>
                            <th scope="col">تاریخ ثبت نظر</th>
                            <th scope="col">عنوان</th>
                            <th scope="col">تعداد لایک</th>
                            <th scope="col">تعداد دیس لایک</th>
                            <th scope="col">وضعیت</th>
                            <th scope="col">عملیات</th>
                        </tr>
                    </thead>
                   
                        <tbody>
                            {
                                comments.map((comment)=>{
                                            const date = new Date(comment.createdAt).toLocaleDateString('fa-IR');
                                            const commentLink = `/users/comments/commentDetails/${comment._id}`;
                                            return(
                                                <tr key={comment._id}>
                                                    <td>{comment.product.fname}</td>
                                                    <td>{comment.user.fname} {comment.user.lname}</td>
                                                    <td>{date}</td>
                                                    <td>{comment.title}</td>
                                                    <td>{comment.like.length}</td>
                                                    <td>{comment.dislike.length}</td>
                                                    <td>
                                                        <Badge color={getBadge(comment.check)} onClick={()=>toggleLarge(comment._id)}>
                                                            {comment.check ? 'تایید شده':'تایید نشده'}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <NavLink to={commentLink}>
                                                            <Button size="sm" color="primary">
                                                                <i className="fa fa-info-circle"></i>
                                                            </Button>
                                                        </NavLink>
                                                        
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    
                               
                            }
                        </tbody>
                    
                </Table>
            </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modal} toggle={toggleLarge}>
                
                <ModalBody>
                آیا مطمئن به تغییر وضعیت این نظر هستید؟
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={ChangeStatus}>تغییر وضعیت </Button>
                    <Button color="primary" onClick={toggleLarge}>لغو </Button>
                </ModalFooter>
        </Modal>
      </div>
    )
  
}

export default AllComments;
