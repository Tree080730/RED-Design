import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
import { brandTheme } from './design-system/theme';
import { TokenProvider } from './design-system/TokenProvider';
import App from './App';
import DemoEntry from './pages/DemoEntry';
import { MouthConfigProvider } from './components/MouthConfig';
import 'antd/dist/reset.css';
import './styles/global.css';
import './styles/page-header.css';
import './styles/no-hover.css';
const path=window.location.pathname;
const isSpecSite=path.endsWith('/design-system')||path.endsWith('/design-system/');
if (/^\/(s\/[^/]+)?\/?$/.test(path)) { window.location.replace('./demo'); }
const isDemo=!isSpecSite;
if (isDemo) { document.documentElement.lang = 'en'; document.title = 'Food Passport · iPhone 17 Pro'; }
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><ConfigProvider theme={brandTheme}><AntApp><TokenProvider>{isDemo?<MouthConfigProvider><DemoEntry/></MouthConfigProvider>:<App />}</TokenProvider></AntApp></ConfigProvider></React.StrictMode>,
);
