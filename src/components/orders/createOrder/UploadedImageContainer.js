import React, { Fragment } from 'react';
import '../../../styles/orders/createOrder/uploadedImageContainer.css';
import Image from 'next/image';
import Document_icon from '../../../icons/document_icon.svg';
import Delete_icon from '../../../icons/delete_colored.svg';
import { Col, Tooltip, message } from 'antd';
import {
  ERROR_IN_FILE_DOWNLOADING,
  getFileTypeForUploadedDocs,
  getFormattedDocumentName,
} from '@/utils/constant.util';
import { FiDownload } from 'react-icons/fi';
import { formatFileSize } from '@/utils/commonFunctions';
import { useDispatch } from 'react-redux';
import {
  deleteUploadedFileById,
  downloadDocumentById,
} from '@/store/orderSlice';
import { useRouter } from 'next/router';

const UploadedImageContainer = ({ data }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orderId } = router.query;

  const handleDeleteUploadedDoc = (id, category) => {
    dispatch(
      deleteUploadedFileById({
        id,
        category,
        orderId,
        isAuth: data.isAuth,
        uploaded: data?.uploaded,
      })
    ).then((res) => {
      if (res?.payload?.status) {
        message.success(res?.payload?.message);
      } else {
        message.error(res?.payload?.message);
      }
    });
  };
  return (
    <Fragment>
      <div className='common-uploaded-doc-child-container-with-size'>
        <div className='common-uploaded-doc-row-with-icon'>
          <div className='common-uploaded-doc-name-row' gutter={12}>
            <div>{getFileTypeForUploadedDocs(data?.documentName)}</div>
            <Tooltip title={getFormattedDocumentName(data?.documentName)}>
              <p className='common-uploaded-doc-name-text'>
                {getFormattedDocumentName(data?.documentName)}
              </p>
            </Tooltip>
          </div>
          <Col>
            <Image
              src={Delete_icon}
              alt='delete'
              className='common-uploaded-doc-delete-icon'
              onClick={() => handleDeleteUploadedDoc(data?.id, data?.category)}
            />
          </Col>
        </div>
        <p className='common-uploaded-doc-size-text'>
          {data?.size
            ? formatFileSize(data?.size)
            : formatFileSize(data?.documentSize)}
        </p>
      </div>
    </Fragment>
  );
};

export default UploadedImageContainer;

export const DisplayFilesContainer = ({ dataObj }) => {
  const dispatch = useDispatch();
  const downloadFile = async () => {
    const response = await dispatch(downloadDocumentById(dataObj?.id));
    if (response.payload && response.payload.status === false) {
      return message.error(ERROR_IN_FILE_DOWNLOADING);
    }
    const filename = dataObj?.documentName;
    const blob = response.payload;

    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Fragment>
      <div className='display-single-doc-file-container'>
        <div className='display-single-doc-file-child-container'>
          <div>{getFileTypeForUploadedDocs(dataObj?.documentName)}</div>

          <Col className='file-name-container-custmized'>
            <Tooltip title={getFormattedDocumentName(dataObj?.documentName)}>
              <h4 className='file-name-text-custmized'>
                {getFormattedDocumentName(dataObj?.documentName)}
              </h4>
            </Tooltip>
            <p className='file-size-text-custmized'>
              {formatFileSize(dataObj?.documentSize)}
            </p>
          </Col>
        </div>
        <div className='download-icon-container-for-docs'>
          {dataObj?.documentURL?.includes('http') ? (
            <a
              href={dataObj.documentURL}
              download={dataObj.documentName}
              target='_blank'
            >
              <FiDownload className='download-icon-for-docs' />
            </a>
          ) : (
            <a onClick={downloadFile}>
              <FiDownload className='download-icon-for-docs' />
            </a>
          )}
        </div>
      </div>
    </Fragment>
  );
};
