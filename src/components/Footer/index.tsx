import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'Casino',
          title: 'Casino',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'louis-lam',
          title: <GithubOutlined />,
          href: 'https://github.com/kuanbase',
          blankTarget: true,
        },
        {
          key: 'Winson',
          title: 'Winson',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
