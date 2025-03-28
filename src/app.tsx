import { Footer, Question, SelectLang, AvatarDropdown } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { currentUser } from '@/services/ant-design-pro/api';
import React from 'react';
import { message } from 'antd';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token');
      }

      console.log('Token: ' + token);

      // 调用获取用户信息的接口
      const response = await currentUser({
        headers: {'Authorization': token, 'Content-Type': 'application/json'},
      });

      if (response.success) {
        // 转换用户信息，确保符合 Ant Design Pro 的结构

        console.log('Successfully fetch user data in');

        console.log("Response " + response.data);

        return {
          name: response.data.name,
          email: response.data.email,
          userid: response.data.number,
          access: response.data.role,
          // 添加头像，如果后端没有提供，可以使用默认头像
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        } as API.CurrentUser;
      }

      throw new Error('Failed to fetch user info');
    } catch (error) {
      console.error('Fetch user info error:', error);
      localStorage.removeItem('access_token');
      history.push(loginPath);
      return undefined;
    }
  };

  const { location } = history;
  if (location.pathname !== loginPath) {
    try {
      const currentUser = await fetchUserInfo();
      return {
        fetchUserInfo,
        currentUser,
        settings: defaultSettings as Partial<LayoutSettings>,
        loading: false,
      };
    } catch (error) {
      return {
        fetchUserInfo,
        loading: false,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    }
  }

  // const currentUser = await fetchUserInfo();

  return {
    fetchUserInfo,
    currentUser,
    settings: defaultSettings as Partial<LayoutSettings>,
    loading: false,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {

  if (!initialState || !initialState.currentUser)
  {
    console.log("InitialState is null");
  }

  return {
    loading: false,
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: initialState?.currentUser?.name ||'User',
      render: (_, avatarChildren) => {
        console.log('Avatar Children:', avatarChildren);

        if (avatarChildren) {
          console.log("OK")
          console.log(currentUser)
          return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
        }

        return <AvatarDropdown>User</AvatarDropdown>
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      const token = localStorage.getItem('access_token');
      if (!token && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // ... 其他配置保持不变
    childrenRender: (children) => {
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

export const request = {
  ...errorConfig,
  requestInterceptors: [
    (url, options) => {
      const token = localStorage.getItem('access_token');

      // 添加 JWT Token 到请求头
      const authHeader = token
        ? {
          Authorization: `Bearer ${token}`,
        }
        : {};

      return {
        url,
        options: {
          ...options,
          headers: {
            ...options.headers,
            ...authHeader
          }
        },
      };
    }
  ],
  responseInterceptors: [
    (response) => {
      // 处理未授权的情况
      if (response.status === 401) {
        message.error('登录已过期，请重新登录');
        localStorage.removeItem('access_token');
        history.push(loginPath);
      }
      return response;
    }
  ],
  errorHandler: (error) => {
    // 统一错误处理
    const { response } = error;
    if (!response) {
      message.error('网络错误');
    }
    throw error;
  }
};
