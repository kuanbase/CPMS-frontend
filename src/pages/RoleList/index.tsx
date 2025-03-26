import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {ActionType, ModalForm, PageContainer, ProColumns, ProFormSelect, ProFormText} from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import {Button, Dropdown, message, Tag} from 'antd';
import React, {useRef, useState} from 'react';
import {
  createRole,
  createUser,
  getRoleList,
  getUserList, removeRole,
  removeUser,
  updateRole,
  updateUser
} from '@/services/ant-design-pro/api';
import {ProForm} from "@ant-design/pro-form/lib";
import {ModalContext} from "antd/es/modal/context";

export default () => {

  const [render, setRender] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const [AddModalVisible, setAddModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<API.RoleItem>(null);
  const actionRef = useRef<ActionType>();

  // 新增角色
  const handleAdd = async (values: API.RoleItem) => {
    try {
      const response = await createRole(values);

      console.log(response);

      console.log("New Role: " + values.name);

      if (response.success) {

        console.log("Successfully created");

        message.success('新增成功');
        setAddModalVisible(false);
        // 刷新表格
        actionRef.current?.reload();
        return true;
      } else {
        message.error('新增失敗');
        return false;
      }
    } catch (error) {
      message.error('新增失敗');
      return false;
    }
  };

  // 編輯角色
  const handleEdit = async (values: API.RoleItem) => {
    try {
      const response = await updateRole({
        ...currentUser,
        ...values
      });
      if (response.success) {
        message.success('編輯成功');
        setEditModalVisible(false);
        // 刷新表格
        actionRef.current?.reload();
        return true;
      } else {
        message.error('編輯失敗');
      }

      return false;
    } catch (error) {
      message.error('編輯失敗');
      return false;
    }
  };

  const handleDelete = async (values: API.RoleItem) => {
    try {
      const response = await removeRole({
        ...currentUser,
        ...values
      });

      if (response.success) {
        message.success('刪除成功');
        setDeleteModalVisible(false);
        actionRef.current?.reload();
        return true;
      } else {
        message.error('刪除失敗')
        return false;
      }
    }
    catch (error) {
      message.error('刪除失敗: ');
      return false;
    }
  };

  const columns: ProColumns<API.RoleItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'id',
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '角色名',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => {
          setCurrentUser((prev) => {
            console.log('Previous user:', prev);
            console.log('New user:', record);
            return record;
          });

          setRender(prev => prev + 1);  // 強制重新渲染

          setEditModalVisible(true);
        }}>编辑</a>,
        <TableDropdown
          key="actionGroup"
          menus={[
            { key: 'delete', name: '删除', onClick: () => {
                setCurrentUser(record);
                setDeleteModalVisible(true);
              }},
            { key: 'details', name: '详情', onClick: () => {
                setCurrentUser(record);
                setDetailsModalVisible(true);
              } },
          ]}
        />,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RoleItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log('params:', params);

          // 调用获取用户列表接口
          const response = await getRoleList({
            page: params.current || 1,
            pageSize: params.pageSize || 10,
          });

          if (response.success) {
            console.log('fetch user list successful!')
            console.log(response.data)
            console.log(response.data[0].name)
          }

          // 前端过滤
          let filteredData = response.data;

          // 按 id 过滤
          if (params.id) {
            filteredData = filteredData.filter(item =>
              item.id.includes(params.id)
            );
          }

          if (params.name) {
            filteredData = filteredData.filter(item => item.name.includes(params.name));
          }

          return {
            data: filteredData,
            success: response.success,
            total: filteredData.length,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowSelection={{
          type: 'checkbox',
        }}
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 10,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() =>{
              setCurrentUser(undefined);
              setAddModalVisible(true);
            }}
          >
            新建
          </Button>
        ]}
      />

      {/* 编辑模态框 */}
      <ModalForm
        key={render}
        title="編輯角色"
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        initialValues={currentUser}
        onFinish={handleEdit}
        // 编辑逻辑
      >
        <ProForm.Group>
          <ProFormText
            name="name"
            label="角色名"
            placeholder="請輸入角色名"
            rules={[{ required: true, message: '請輸入角色名' }]}
          />
        </ProForm.Group>
      </ModalForm>

      <ModalForm
        key={render}
        title="新增用户"
        open={AddModalVisible}
        onOpenChange={setAddModalVisible}
        initialValues={currentUser}
        onFinish={handleAdd}
      >
        <ProForm.Group>
          <ProFormText
            name="name"
            label="角色名"
            placeholder="請輸入角色名"
            rules={[{ required: true, message: '請輸入角色名' }]}
          />
        </ProForm.Group>
      </ModalForm>

      <ModalForm
        key={render}
        title="刪除角色"
        open={deleteModalVisible}
        onOpenChange={setDeleteModalVisible}
        initialValues={currentUser}
        onFinish={handleDelete}
        // 编辑逻辑
      >
        <ProForm.Group>
          <ProFormText
            name="name"
            label="角色名"
            placeholder="請輸入角色名"
            readonly
            rules={[{ required: true, message: '請輸入角色名' }]}
          />
        </ProForm.Group>
      </ModalForm>

      <ModalForm
        key={render}
        title={'詳情'}
        open={detailsModalVisible}
        onOpenChange={setDetailsModalVisible}
        initialValues={currentUser}
        submitter={false}
      >
        <ProForm.Group>
          <ProFormText
            name="name"
            label="角色名"
            placeholder="請輸入角色名"
            readonly
            rules={[{ required: true, message: '請輸入角色名' }]}
          />
        </ProForm.Group>
      </ModalForm>

    </PageContainer>
  );
}
