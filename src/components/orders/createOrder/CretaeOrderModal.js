import React from "react";
import "../../../styles/orders/createOrder/createOrderModal.css";
import { Col } from "antd";

const CretaeOrderModal = ({ dataObj }) => {
  return (
    <div className="order-detail-display-modal-container">
      <Col>
        <label className="order-detail-display-modal-label">First Name</label>
        <h3 className="order-detail-display-modal-heading">
          {dataObj?.first_name}
        </h3>
      </Col>
      <Col>
        <label className="order-detail-display-modal-label">Last Name</label>
        <h3 className="order-detail-display-modal-heading">
          {dataObj?.last_name}
        </h3>
      </Col>
      <Col>
        <label className="order-detail-display-modal-label">NPI Number</label>
        <h3 className="order-detail-display-modal-heading">
          {dataObj?.npiNumber}
        </h3>
      </Col>
    </div>
  );
};

export default CretaeOrderModal;
