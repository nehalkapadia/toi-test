import React, { useEffect } from "react";
import "../../styles/users/displayUser.css";
import { Button, Col, Row, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "@/store/userTableDataSlice";
import { getRoleById } from "@/utils/commonFunctions";

const DisplayUser = ({
  columnId,
  onClose,
  organizationName,
}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.userTable.viewIsLoading);
  const getUserDetails = useSelector(
    (state) => state.userTable.getUserDetails
  );
  const { firstName, lastName, email, roleId, isActive } = getUserDetails;

  useEffect(() => {
    if (columnId) {
      dispatch(getUserById(columnId));
    }
  }, [columnId]);

  return (
    <>
      {isLoading ? (
        <Skeleton active paragraph={{ row: 18 }} />
      ) : (
        <div className="display-user-details-container">
          <Row className="display-user-rows-parent-container">
            <Col className="every-single-row-in-user-display-details">
              <p className="column-name-lable-at-user-mgt">Organization</p>
              <p className="column-name-heading-text-at-user-mgt">
                {organizationName}
              </p>
            </Col>

            <Col className="every-single-row-in-user-display-details">
              <p className="column-name-lable-at-user-mgt">Email ID</p>
              <p className="email-class-at-display-user-details">
                {email}
              </p>
            </Col>

            <Col className="every-single-row-in-user-display-details">
              <p className="column-name-lable-at-user-mgt">First Name</p>
              <p className="column-name-heading-text-at-user-mgt">
                {firstName}
              </p>
            </Col>

            <Col className="every-single-row-in-user-display-details">
              <p className="column-name-lable-at-user-mgt">Last Name</p>
              <p className="column-name-heading-text-at-user-mgt">{lastName}</p>
            </Col>
          </Row>

          <Row className="display-user-rows-parent-container">
            <Col className="every-single-row-in-user-display-details">
              <p className="column-name-lable-at-user-mgt">Role</p>
              <p className="column-name-heading-text-at-user-mgt">
                {getRoleById(roleId)}
              </p>
            </Col>

            <Col className="every-single-row-in-user-display-details">
              <p className="column-name-lable-at-user-mgt">Status</p>
              <p className={` user-current-${isActive}`}>
                {isActive ? "Active" : "InActive"}
              </p>
            </Col>
          </Row>

          <Col className="edit-component-btn-container-parent-at-user">
            <Row className="cancel-and-submit-btn-container-at-user-edit">
              <Button
                size="large"
                className="user-mgt-edit-btn-for-cancel"
                onClick={onClose}
              >
                Close
              </Button>
            </Row>
          </Col>
        </div>
      )}
    </>
  );
};

export default DisplayUser;
