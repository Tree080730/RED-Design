import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
import { brandTheme } from './design-system/theme';
import { TokenProvider } from './design-system/TokenProvider';
import App from './App';
import DietPreferences from './pages/DietPreferences';
import { MouthConfigProvider } from './components/MouthConfig';
import 'antd/dist/reset.css';
import './styles/global.css';
if (window.location.pathname.startsWith('/demo')) { document.documentElement.lang = 'en'; document.title = 'Food Passport · iPhone 17 Pro'; }
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><ConfigProvider theme={brandTheme}><AntApp><TokenProvider>{window.location.pathname.startsWith('/demo')?<MouthConfigProvider><DietPreferences/></MouthConfigProvider>:<App />}</TokenProvider></AntApp></ConfigProvider></React.StrictMode>,
);
