import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom"; // МЕНЯЕМ НА HashRouter
import App from "./App";
import { store } from "./store";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        {" "}
        {/* МЕНЯЕМ BrowserRouter НА HashRouter */}
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
);
