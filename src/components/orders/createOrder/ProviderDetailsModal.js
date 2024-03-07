import React, { Fragment } from 'react';
import '../../../styles/orders/createOrder/createOrderModal.css';
import { Button, Col, Modal } from 'antd';
import { AiOutlineClose } from 'react-icons/ai';
import {
  MEDICAL_HISTORY_PROVIDER_TYPES,
  PROVIDER_DETAILS,
  VALIDATE_PROVIDER_DETAILS,
} from '@/utils/constant.util';
import { useDispatch } from 'react-redux';
import {
  postRegisterNPIDataAfterValidate,
  setDisplayOrderingModal,
  setDisplayPCPNumberModal,
  setDisplayReferringModal,
  setValidationCancelForOrdering,
  setValidationCancelForPCPNumber,
  setValidationCancelForReferring,
} from '@/store/orderSlice';
import {
  setDisplayPcpNumberSuccessTick,
  setDisplayReferringSuccessTick,
  setDisplayorderingSuccessTick,
} from '@/store/createOrderFormSlice';

const ProviderDetailsModal = (props) => {
  const { dataObj, isSuccessTick, providerType, shouldDisplayModal } = props;
  const dispatch = useDispatch();

  const handleHideModal = (type) => {
    if (type === MEDICAL_HISTORY_PROVIDER_TYPES.orderingProvider) {
      dispatch(setDisplayOrderingModal(false));
    } else if (type === MEDICAL_HISTORY_PROVIDER_TYPES.referringProvider) {
      dispatch(setDisplayReferringModal(false));
    } else if (type === MEDICAL_HISTORY_PROVIDER_TYPES.pcpName) {
      dispatch(setDisplayPCPNumberModal(false));
    }
  };

  const handleCancelOfModal = (type) => {
    if (type === MEDICAL_HISTORY_PROVIDER_TYPES.orderingProvider) {
      dispatch(setDisplayOrderingModal(false));
      dispatch(setValidationCancelForOrdering());
    } else if (type === MEDICAL_HISTORY_PROVIDER_TYPES.referringProvider) {
      dispatch(setDisplayReferringModal(false));
      dispatch(setValidationCancelForReferring());
    } else if (type === MEDICAL_HISTORY_PROVIDER_TYPES.pcpName) {
      dispatch(setDisplayPCPNumberModal(false));
      dispatch(setValidationCancelForPCPNumber());
    }
  };

  const handleConfirmOfModal = (type) => {
    if (type === MEDICAL_HISTORY_PROVIDER_TYPES.orderingProvider) {
      dispatch(setDisplayOrderingModal(false));
      dispatch(setDisplayorderingSuccessTick(true));
      dispatch(postRegisterNPIDataAfterValidate(dataObj));
    } else if (type === MEDICAL_HISTORY_PROVIDER_TYPES.referringProvider) {
      dispatch(setDisplayReferringModal(false));
      dispatch(setDisplayReferringSuccessTick(true));
      dispatch(postRegisterNPIDataAfterValidate(dataObj));
    } else if (type === MEDICAL_HISTORY_PROVIDER_TYPES.pcpName) {
      dispatch(setDisplayPCPNumberModal(false));
      dispatch(setDisplayPcpNumberSuccessTick(true));
      dispatch(postRegisterNPIDataAfterValidate(dataObj));
    }
  };
  return (
    <Fragment>
      <Modal
        title={
          <div className='modal-title-container-with-close-icon'>
            <h3 className='tab-2-modal-title-heading-text'>
              {isSuccessTick ? PROVIDER_DETAILS : VALIDATE_PROVIDER_DETAILS}
            </h3>
            {isSuccessTick && (
              <AiOutlineClose
                onClick={() => handleHideModal(providerType)}
                className='close-icon-for-modal'
              />
            )}
          </div>
        }
        open={shouldDisplayModal}
        className='medical-history-modal-customized'
        transitionName=''
        closable={false}
        footer={
          !isSuccessTick
            ? [
                <Button
                  key={'cancelBtn'}
                  size='large'
                  onClick={() => handleCancelOfModal(providerType)}
                >
                  Cancel
                </Button>,
                <Button
                  key={'verifyBtn'}
                  size='large'
                  className='co-tab-2-modal-validate-btn'
                  onClick={() => handleConfirmOfModal(providerType)}
                >
                  Verify
                </Button>,
              ]
            : null
        }
      >
        <div className='order-detail-display-modal-container'>
          <Col>
            <label className='order-detail-display-modal-label'>
              First Name
            </label>
            <h3 className='order-detail-display-modal-heading'>
              {dataObj?.first_name}
            </h3>
          </Col>
          <Col>
            <label className='order-detail-display-modal-label'>
              Last Name
            </label>
            <h3 className='order-detail-display-modal-heading'>
              {dataObj?.last_name ? dataObj?.last_name : '-'}
            </h3>
          </Col>
          <Col>
            <label className='order-detail-display-modal-label'>
              NPI Number
            </label>
            <h3 className='order-detail-display-modal-heading'>
              {dataObj?.npiNumber}
            </h3>
          </Col>
        </div>
      </Modal>
    </Fragment>
  );
};

export default ProviderDetailsModal;
