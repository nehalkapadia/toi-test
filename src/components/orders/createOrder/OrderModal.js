import { Modal } from 'antd'
import React from 'react'
import { AiFillExclamationCircle } from 'react-icons/ai'
import '../../../styles/orders/createOrder/cancelOrderModal.css'

function OrderModal(props) {

  return (
    <div>
      <Modal
        title={props.title}
        open={props.open}
        onOk={props.handleOk}
        confirmLoading={props.confirmLoading}
        onCancel={props.handleCancel}
        width={400}
        okText={props.okText}
        cancelText={props.cancelText}
      >
        <b>{props.modalText}</b>
      </Modal>
    </div>
  )
}

export default OrderModal
