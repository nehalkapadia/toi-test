import React from 'react';
import './customTable.css';
import propTypes from 'prop-types';
import { Table, Button } from 'antd';
import Image from 'next/image';
import Create_User_Icon from '../../icons/create_user.svg';
import View_Icon from '../../icons/eye_icon.svg';
import Edit_Icon from '../../icons/pen.svg';
import Delete_Icon from '../../icons/trash.svg';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {
  resetCreateOrderDataBacktoInitialState,
  setTab2FormData,
} from '@/store/createOrderFormSlice';
import { resetOrderStateToInitialState } from '@/store/orderSlice';
import { TOTAL_ITEMS_PER_PAGE } from '@/utils/constant.util';

const CustomTable = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { pathname } = router;
  const { columns, rows, rowSelectionType, total, size = 'default' } = props;

  const prepareRowSelection = () => {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        props.onSelectRows && props.onSelectRows(selectedRowKeys, selectedRows);
      },
      getCheckboxProps: props.checkboxProps,
    };
    return rowSelection;
  };

  const addUserFunction = (e, record, onNewUserAdd) => {
    e.stopPropagation();
    onNewUserAdd && onNewUserAdd(record);
  };

  const viewFunction = (event, record, onView) => {
    event.stopPropagation();
    onView && onView(record);
  };

  const editFunction = (event, record, onEdit) => {
    event.stopPropagation();
    if (pathname === '/order-management') {
      dispatch(resetOrderStateToInitialState());
      dispatch(resetCreateOrderDataBacktoInitialState());
      dispatch(setTab2FormData({}));
    }
    onEdit && onEdit(record);
  };

  const deleteFunction = (event, record, onDelete) => {
    event.stopPropagation();
    onDelete && onDelete(record);
  };

  const prepareTableColumns = () => {
    let allColumns = [...columns];
    const {
      isUserAddEnabled,
      isViewable,
      isEditable,
      isDeleteable,
      onNewUserAdd,
      onView,
      onEdit,
      onDelete,
    } = props;

    if (isUserAddEnabled || isViewable || isEditable || isDeleteable) {
      allColumns = [
        ...columns,
        {
          title: 'Actions',
          dataIndex: 'actions',
          width: '180px',
          render: (_, record) => {
            return (
              <div className='table-action-btn-container'>
                {isUserAddEnabled && (
                  <Button
                    type='link'
                    onClick={(e) => {
                      addUserFunction(e, record, onNewUserAdd);
                    }}
                  >
                    <Image src={Create_User_Icon} alt='View' />
                  </Button>
                )}

                {isViewable && (
                  <Button
                    type='link'
                    onClick={(e) => {
                      viewFunction(e, record, onView);
                    }}
                  >
                    <Image src={View_Icon} alt='View' />
                  </Button>
                )}

                {isEditable &&
                  pathname !== '/order-management' &&
                  record?.name?.toLowerCase() !== 'toi' && (
                    <Button
                      type='link'
                      onClick={(e) => editFunction(e, record, onEdit)}
                    >
                      <Image src={Edit_Icon} alt='Edit' />
                    </Button>
                  )}

                {isEditable &&
                  pathname === '/order-management' &&
                  record?.currentStatus?.toLowerCase() === 'draft' &&
                  record?.userData?.isActive && (
                    <Button
                      type='link'
                      onClick={(e) => editFunction(e, record, onEdit)}
                    >
                      <Image src={Edit_Icon} alt='Edit' />
                    </Button>
                  )}

                {isDeleteable && pathname !== '/order-management' && (
                  <Button
                    type='link'
                    onClick={(e) => deleteFunction(e, record, onDelete)}
                  >
                    <Image className='red-5' src={Delete_Icon} alt='Delete' />
                  </Button>
                )}

                {isDeleteable &&
                  pathname === '/order-management' &&
                  record?.currentStatus?.toLowerCase() === 'draft' &&
                  record?.userData?.isActive && (
                    <Button
                      type='link'
                      onClick={(e) => deleteFunction(e, record, onDelete)}
                    >
                      <Image className='red-5' src={Delete_Icon} alt='Delete' />
                    </Button>
                  )}
              </div>
            );
          },
        },
      ];
    }
    return allColumns;
  };

  return (
    <div className='custom-table-container' style={{ overflowX: 'auto' }}>
      <Table
        className={props.className || ''}
        rowKey={props.rowKey || 'id'}
        dataSource={rows ? rows : []}
        columns={prepareTableColumns() ? prepareTableColumns() : columns}
        scroll={props?.scroll || {}}
        rowSelection={
          rowSelectionType
            ? { type: 'checkbox', ...prepareRowSelection() }
            : null
        }
        pagination={
          props?.pagination
            ? props?.current
              ? {
                  showSizeChanger: false,
                  showQuickJumper:
                    props?.showQuickJumper === false ? false : true,
                  defaultPageSize: props.pageSize
                    ? props.pageSize
                    : TOTAL_ITEMS_PER_PAGE,
                  showTotal: (total) => `Total ${total} items`,
                  total: total,
                  current: props.current,
                  position: ['bottomRight'],
                  onChange: (page) => {
                    props.onPageChange(page);
                  },
                }
              : {
                  showSizeChanger: total > TOTAL_ITEMS_PER_PAGE ? true : false,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} items`,
                  total: { total },
                  position: ['bottomRight'],
                  defaultPageSize: props.pageSize
                    ? props.pageSize
                    : TOTAL_ITEMS_PER_PAGE,
                }
            : props?.pagination
        }
        size={size}
        footer={false}
      />
    </div>
  );
};

CustomTable.propTypes = {
  total: propTypes.number,
  rowSelectionType: propTypes.bool,
  isPopup: propTypes.bool,
  size: propTypes.string,
  onSelectRows: propTypes.func,
  checkboxProps: propTypes.func,
  columns: propTypes.arrayOf(propTypes.object),
  isEditable: propTypes.bool,
  isDeleteable: propTypes.bool,
  isViewable: propTypes.bool,
  onView: propTypes.func,
  onDelete: propTypes.func,
  onEdit: propTypes.func,
  isUserAddEnabled: propTypes.bool,
  onNewUserAdd: propTypes.func,
  className: propTypes.string,
  rows: propTypes.arrayOf(propTypes.object),
  rowKey: propTypes.string,
  current: propTypes.number,
  onPageChange: propTypes.func,
  pagination: propTypes.bool,
  pageSize: propTypes.number,
  showQuickJumper: propTypes.bool,
};

export default CustomTable;
