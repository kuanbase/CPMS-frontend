import React, { useEffect, useState } from 'react';

import { getToken } from '@/services/auth';
import { authAPI } from '@/services/api';

const TestComponent = () => {
  const [token, setToken] = useState(null);  // 用于保存 token 的状态
  const [error, setError] = useState(null);  // 用于保存错误信息的状态

  useEffect(() => {

    getToken()
      .then((response) => {
        console.log('Response:', response);
        if (response && response.token) {
          setToken(response.token);  // 提取 token 并存储到 state
        } else {
          setError('Token not found in response');
        }
      })
      .catch((error) => {
        console.error('Request Error:', error);
        setError('Failed to fetch token');
      });
  }, []);

  return (
    <div>
      <div>Testing API Request</div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {token ? (
        <div>
          <h3>Token:</h3>
          <p>{token}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default TestComponent;
