import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
import { brandTheme } from './design-system/theme';
import { TokenProvider } from './design-system/TokenProvider';
import App from './App';
import 'antd/dist/reset.css';
import './styles/global.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><ConfigProvider theme={brandTheme}><AntApp><TokenProvider><App /></TokenProvider></AntApp></ConfigProvider></React.StrictMode>,
);
