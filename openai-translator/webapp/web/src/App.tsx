import React from 'react';
import { Button, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Home from './pages/Home';
import './App.css';

const App: React.FC = () => (
  <ConfigProvider
    locale={zhCN}
    theme={{
      token: {
        // Seed Token，影响范围大
        // colorPrimary: '#00b96b',
        // borderRadius: 5,
        // 派生变量，影响范围小
        // colorBgContainer: '#f6ffed',
      }
      // 1. 单独使用暗色算法
      // algorithm: theme.darkAlgorithm,
    }}
  >
    {/* <img src="./static/bg.jpg" /> */}

    <div className="App">
      <Home></Home>
    </div>
  </ConfigProvider>
);

export default App;
