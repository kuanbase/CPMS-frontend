// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { url } from '../util'
// import UserDto = API.UserDto;

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return await request<{
    success: boolean;
    data: UserDto;
  }>(url + '/User/GetUserByOwner', {
    method: 'GET',
    ...(options || {}),
  });
}
// 獲取用户列表
export async function getUserList(params: {
  page: number;
  pageSize: number;
}) {
  return request<{
    success: boolean;
    data: any[];
    // total: number;
    // page: number;
    // pageSize: number;
    ssc: any[];
  }>(url + '/User/GetListByCurrentIndex', {
    method: 'GET',
    params,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    }
  });
}

export async function GetOnlineUserList() {
  return await request<{
    success: boolean;
    data: any[];
  }>(url + '/User/GetOnlineUserList', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    }
  });
}

// 獲取用戶數量
export async function getUserAmount() {
  return await request<{
    success: boolean;
    data: number;
  }>(url + '/User/GetUserAmount', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    }
  });
}

export async function getRoleAmount() {
  return await request<{
    success: boolean;
    data: number;
  }>(url + '/Role/GetRoleAmount', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    }
  });
}

export async function getRoleList(params: {
  page: number;
  pageSize: number;
}) {
  return request<{
    success: boolean;
    data: any[];
    ssc: any[];
  }>(url + '/role/GetListByCurrentIndex', {
    method: 'GET',
    params,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    }
  })
}

export async function getRoleListAll()
{
  return request<{
    success: boolean;
    data: any[];
  }>(url + '/role/GetRoleList', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    },
  })
}

// 定义与后端 DTO 匹配的接口
interface UserDto {
  id?: string,
  name?: string;
  number?: number;
  email?: string;
  password?: string;
  createdDate?: Date;
  role?: string;
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>(url + '/Auth/GetAdminToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function createUser(body: API.UserDtosItem, options?: { [key: string]: any }) {
  return request<API.RegisterResponse>(url + '/User/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function createRole(body: API.RoleItem, options?: { [key: string]: any }) {
  return request<API.RegisterResponse>(url + '/role/CreateRole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

export async function updateUser(body: API.UserDtosItem, options?: { [key: string]: any }) {
  return request<API.RegisterResponse>(url + '/User/ModifyUserById', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

export async function updateRole(body: API.RoleItem, options?: { [key: string]: any }) {
  return request<API.RegisterResponse>(url + '/Role/ModifyRoleById', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

export async function removeUser(body: API.UserDtosItem, options?: { [key: string]: any }) {
  return request<API.RegisterResponse>(url + '/User/RemoveById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

export async function removeRole(body: API.RoleItem, options?: { [key: string]: any }) {
  return request<API.RegisterResponse>(url + '/Role/RemoveById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

export async function GetLogsAll() {
  return await request<{
    success: boolean;
    data: any[];
  }>(url + '/logs/GetLogsAll', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    }
  });
}

export async function GetLogs() {
  return await request<{
    success: boolean;
    data: string[];
  }>(url + '/logs/recent', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    },
  });
}



