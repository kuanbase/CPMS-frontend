import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Row,
  Col,
  Statistic,
  Timeline,
  Button,
  Space
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  FileProtectOutlined,
  AlertOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import {
  GetLogs,
  GetLogsAll,
  GetOnlineUserList,
  getRoleAmount,
  getRoleList,
  getUserAmount,
  getUserList
} from "@/services/ant-design-pro/api";
import {ModalForm} from "@ant-design/pro-components";
import {forEach} from "lodash";

const totalUsers = (await getUserAmount()).data;
const roles = (await getRoleAmount()).data;
const activeUsers = (await GetOnlineUserList()).data.length;
const logs = (await GetLogs());

if (logs.success) {
  console.log("LOGS: " + logs.data.logs);
} else {
  console.log("LOGS: 請求失敗");
}

const Dashboard: React.FC = () => {
  // 統計數據
  const [statistics, setStatistics] = useState({
    totalUsers: totalUsers,
    activeUsers: activeUsers,
    roles: roles,
  });

  const systemLogs = [];

  for (let i = 0; i < logs.data.logs.length; i++) {
    systemLogs.push(
    {
          color: 'green',
          children: logs.data.logs[i],
    });
  }

  // 系統操作日誌
  // const systemLogs = [
  //   {
  //     color: 'green',
  //     children: '管理員 admin 修改了角色權限',
  //     time: '2023-06-15 10:30:00'
  //   },
  //   {
  //     color: 'blue',
  //     children: '新增用戶 user01',
  //     time: '2023-06-14 14:20:00'
  //   },
  //   {
  //     color: 'red',
  //     children: '檢測到可疑登錄行為',
  //     time: '2023-06-13 09:45:00'
  //   }
  // ];

  return (
    <PageContainer>
      {/* 統計卡片 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="總用戶數"
              value={statistics.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="在線用戶"
              value={statistics.activeUsers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="角色數量"
              value={statistics.roles}
              prefix={<LockOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/*<ModalForm open={}>*/}

      {/*</ModalForm>*/}

      {/* 快速操作和系統日誌 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        {/* 系統操作日誌現在佔據更大的空間 */}
        <Col span={24}>
          <Card
            title="系統日誌"
            extra={<SecurityScanOutlined />}
            style={{ height: '400px', overflowY: 'auto' }}
          >
            <Timeline>
              {systemLogs.map((log, index) => (
                <Timeline.Item key={index} color={log.color}>
                  {log.children}
                  <p>{log.time}</p>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
