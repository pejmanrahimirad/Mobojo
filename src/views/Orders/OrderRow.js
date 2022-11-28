import { cilChevronLeft, cilHamburgerMenu, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CTableDataCell, CTableRow } from '@coreui/react';
import React from 'react'
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import './style.css'
const OrderRow = (props) => {
    const { item, toggleLarge } = props;
    const { fname, lname } = item.user
    const orderLink = `/orders/orderdetails/${item._id}`
    return (
        <CTableRow key={item._id}>
            <CTableDataCell>{item._id}</CTableDataCell>
            <CTableDataCell>{fname} {lname}</CTableDataCell>
            <CTableDataCell className={'preview'} >
                {item.orderStatus.name}
                <Badge color='warning' onClick={() => toggleLarge(item._id)} style={{ padding: 'inherit' }}>
                    <CIcon
                        icon={cilPencil}
                        size="sm"
                    />
                </Badge>
            </CTableDataCell>
            <CTableDataCell>{new Date(item.createdAt).toLocaleDateString('fa-IR')}</CTableDataCell>
            <CTableDataCell>{
                new Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR' }).format(item.price)

            }</CTableDataCell>
            <CTableDataCell>
                {(item.success) ?
                    <Badge color='success'>
                        پرداخت شده</Badge>
                    :
                    <Badge color='danger'>
                        لغو شده</Badge>
                }
            </CTableDataCell>
            <CTableDataCell>
                <Link to={orderLink}>
                    <Badge size="sm" color='info'>
                        <CIcon
                            icon={cilChevronLeft}
                            size="sm"
                        />
                    </Badge>
                </Link>
            </CTableDataCell>

        </CTableRow>

    )
}
export default OrderRow;