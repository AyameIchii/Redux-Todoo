import './index.css'
import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './Store/store.jsx';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* store trở thành nguồn dữ liệu chung cho toàn bộ ứng dụng */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);



