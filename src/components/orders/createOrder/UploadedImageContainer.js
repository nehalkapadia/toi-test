import React, { Fragment } from "react";
import "../../../styles/orders/createOrder/uploadedImageContainer.css";
import Image from "next/image";
import Document_icon from "../../../icons/document_icon.svg";
import Delete_icon from "../../../icons/delete_colored.svg";
import { Col } from "antd";
import { getFileTypeForUploadedDocs, getFormattedDocumentName } from "@/utils/constant.util";
import { FiDownload } from "react-icons/fi";
const UploadedImageContainer = ({ data = [] }) => {
  const newData = [...data,{ name: "test.pdf", size: "2.4mb" }];
    return (
      // When array has multiple items then give overflow scroll to parent tag. with padding and gap
    <Fragment>
      {newData.map((elem, index) => (
        <div key={index} className="common-uploaded-doc-child-container-with-size">
          <div className="common-uploaded-doc-row-with-icon">
            <div className="common-uploaded-doc-name-row" gutter={12}>
              <Image src={Document_icon} alt="doc" />
              <p className="common-uploaded-doc-name-text">{elem.name}</p>
            </div>
            <Col>
              <Image src={Delete_icon} alt="delete" />
            </Col>
          </div>
          <p className="common-uploaded-doc-size-text">{elem.size}</p>
        </div>
      ))}
    </Fragment>
  );
};

export default UploadedImageContainer;


export const DisplayFilesContainer = ({attachmentsArr=[{fileName: "test.pdf", size: "2.4mb"}]}) => {
  
  return (
    <Fragment>
      {
        attachmentsArr.length>0 && attachmentsArr.map((elem, index) => (
          <div key={index} className="display-single-doc-file-container" >
            <div className="display-single-doc-file-child-container">
              <div>{getFileTypeForUploadedDocs(elem?.fileName)}</div>
              <Col className="file-name-container-custmized">
                <h4 className="file-name-text-custmized" >{getFormattedDocumentName(elem?.fileName)}</h4>
                <p className="file-size-text-custmized">{elem.size}</p>
              </Col>
            </div>
            <div className="download-icon-container-for-docs">
              <FiDownload className="download-icon-for-docs" />
            </div>
          </div>
        ))
      }
    </Fragment>
  )
}
