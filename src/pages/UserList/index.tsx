import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {ActionType, ModalForm, PageContainer, ProColumns, ProFormSelect, ProFormText} from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import {Button, Dropdown, message, Tag} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {
  createUser,
  getRoleList,
  getRoleListAll,
  getUserList,
  removeUser,
  updateUser
} from '@/services/ant-design-pro/api';
import {ProForm} from "@ant-design/pro-form/lib";
import {ModalContext} from "antd/es/modal/context";

export default () => {

  const [render, setRender] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const [RegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserDtosItem>(null);
  const actionRef = useRef<ActionType>();

  // 新增用戶
  const handleAdd = async (values: API.UserDtosItem) => {
    try {
      const response = await createUser(values);

      console.log(response);

      console.log("New User: " + values.name);

      if (response.success) {

        console.log("Successfully created");

        message.success('新增成功');
        setRegisterModalVisible(false);
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

  // 編輯用戶
  const handleEdit = async (values: API.UserDtosItem) => {
    try {
      const response = await updateUser({
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

  const handleDelete = async (values: API.UserDtosItem) => {
    try {
      const response = await removeUser({
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

  const columns: ProColumns<API.UserDtosItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      copyable: true,
    },
    {
      title: '编号',
      dataIndex: 'number',
    },
    {
      title: '角色',
      dataIndex: 'role',
      // valueEnum: {
      //   'ADMINISTRATOR': { text: 'ADMINISTRATOR', status: 'Success' },
      //   'User Manager': { text: 'USER MANAGER', status: 'Processing' },
      //   'Table Manager': { text: 'TABLE MANAGER', status: 'Warning' },
      //   'Dealer': { text: 'DEALER', status: 'Default' }
      // },
      render: (_, record) => (
        <Tag color={record.role === 'ADMINISTRATOR' ? 'green' : 'blue'}>
          {record.role}
        </Tag>
      ),
    },
    {
      title: '创建日期',
      dataIndex: 'createdDate',
      valueType: 'date',
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
      <ProTable<API.UserDtosItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log('params:', params);

          // 调用获取用户列表接口
          const response = await getUserList({
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

          // 按名称过滤
          if (params.name) {
            filteredData = filteredData.filter(item =>
              item.name.includes(params.name)
            );
          }

          // 按邮箱过滤
          if (params.email) {
            filteredData = filteredData.filter(item =>
              item.email.includes(params.email)
            );
          }

          // 按角色过滤
          if (params.role) {
            filteredData = filteredData.filter(item =>
              item.role === params.role ||
              item.role.includes(params.role)
            );
          }

          if (params.createdDate) {
            const searchDate = new Date(params.createdDate);
            filteredData = filteredData.filter(item => {
              const itemDate = new Date(item.createdDate);
              return itemDate.toISOString().startsWith(searchDate.toISOString().split('T')[0]);
            });
          }

          if (params.number) {
            console.log('Number filter:', params.number);
            filteredData = filteredData.filter(item => {
              console.log('Current item:', item);
              return String(item.number).includes(String(params.number));
            });
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
              setRegisterModalVisible(true);
            }}
          >
            新建
          </Button>
        ]}
      />

      {/* 编辑模态框 */}
      <ModalForm
        key={render}
        title="編輯用户"
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        initialValues={currentUser}
        onFinish={handleEdit}
        // 编辑逻辑
      >
        <ProForm.Group>
          <ProFormText
            name="name"
            label="用戶名"
            placeholder="請輸入用戶名"
            rules={[{ required: true, message: '請輸入用戶名' }]}
          />
          <ProFormText
            name="email"
            label="電子郵件"
            placeholder="請輸入電子郵件"
            rules={[
              { required: true, message: '請輸入電子郵件' },
              { type: 'email', message: '請輸入正確的電子郵件' }
            ]}
          />
          <ProFormText.Password
            name="password"
            label="密碼"
            placeholder="請輸入密碼"
            rules={[{ required: !currentUser, message: '請輸入密碼' }]}
          />
          <ProFormSelect
            name="role"
            label="角色"
            request={async () => {
              console.log('Request 方法被調用');  // 增加這行
              try {
                const response = await getRoleListAll();

                console.log("Response " + response.data);

                if (response.success) {
                  console.log("成功獲取");
                  return response.data.map(role => ({
                    label: role.name,
                    value: role.name
                  }));
                }

                console.log("失敗")

                return [];
              } catch (error) {
                message.error('獲取角色失敗');
                return [];
              }
            }}
            rules={[{ required: true, message: '請選擇角色' }]}
          />
        </ProForm.Group>
      </ModalForm>

      <ModalForm
        key={render}
        title="新增用户"
        open={RegisterModalVisible}
        onOpenChange={setRegisterModalVisible}
        initialValues={currentUser}
        onFinish={handleAdd}
      >
        <ProForm.Group>
          <ProFormText
            name="name"
            label="用戶名"
            placeholder="請輸入用戶名"
            rules={[{ required: true, message: '請輸入用戶名' }]}
          />
          <ProFormText
            name="email"
            label="電子郵件"
            placeholder="請輸入電子郵件"
            rules={[
              { required: true, message: '請輸入電子郵件' },
              { type: 'email', message: '請輸入正確的電子郵件' }
            ]}
          />
          <ProFormText.Password
            name="password"
            label="密碼"
            placeholder="請輸入密碼"
            rules={[{ required: !currentUser, message: '請輸入密碼' }]}
          />
          <ProFormSelect
            name="role"
            label="角色"
            options={[
              { label: 'ADMINISTRATOR', value: 'ADMINISTRATOR' },
              { label: 'USER MANAGER', value: 'User Manager' },
              { label: 'TABLE MANAGER', value: 'Table Manager' },
              { label: 'DEALER', value: 'Dealer' },
            ]}
            rules={[{ required: true, message: '請選擇角色' }]}
          />
        </ProForm.Group>
      </ModalForm>

      <ModalForm
        key={render}
        title="刪除用户"
        open={deleteModalVisible}
        onOpenChange={setDeleteModalVisible}
        initialValues={currentUser}
        // 编辑逻辑
      >
        <ProForm.Group>
          <ProFormText
            name="name"
            label="用戶名"
            placeholder="請輸入用戶名"
            readonly
            rules={[{ required: true, message: '請輸入用戶名' }]}
          />
          <ProFormText
            name="email"
            label="電子郵件"
            placeholder="請輸入電子郵件"
            readonly
            rules={[
              { required: true, message: '請輸入電子郵件' },
              { type: 'email', message: '請輸入正確的電子郵件' }
            ]}
          />
          <ProFormText.Password
            name="password"
            label="密碼"
            placeholder="請輸入密碼"
            readonly
            rules={[{ required: !currentUser, message: '請輸入密碼' }]}
          />
          <ProFormSelect
            name="role"
            label="角色"
            readonly
            options={[
              { label: 'ADMINISTRATOR', value: 'ADMINISTRATOR' },
              { label: 'USER MANAGER', value: 'User Manager' },
              { label: 'TABLE MANAGER', value: 'Table Manager' },
              { label: 'DEALER', value: 'Dealer' },
            ]}
            rules={[{ required: true, message: '請選擇角色' }]}
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
            label="用戶名"
            readonly
            placeholder="請輸入用戶名"
            rules={[{ required: true, message: '請輸入用戶名' }]}
          />
          <ProFormText
            name="email"
            label="電子郵件"
            placeholder="請輸入電子郵件"
            readonly
            rules={[
              { required: true, message: '請輸入電子郵件' },
              { type: 'email', message: '請輸入正確的電子郵件' }
            ]}
          />
          <ProFormText.Password
            name="password"
            label="密碼"
            readonly
            placeholder="請輸入密碼"
            rules={[{ required: !currentUser, message: '請輸入密碼' }]}
          />
          <ProFormSelect
            name="role"
            label="角色"
            readonly
            options={[
              { label: 'ADMINISTRATOR', value: 'ADMINISTRATOR' },
              { label: 'USER MANAGER', value: 'User Manager' },
              { label: 'TABLE MANAGER', value: 'Table Manager' },
              { label: 'DEALER', value: 'Dealer' },
            ]}
            rules={[{ required: true, message: '請選擇角色' }]}
          />
        </ProForm.Group>
      </ModalForm>

    </PageContainer>
  );
}
