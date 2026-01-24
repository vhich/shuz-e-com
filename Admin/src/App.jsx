import React from "react";
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Mainlayout from "./layouts/Mainlayout";
import UploadProduct from "./pages/UploadProduct";
import AdminLogin from "./pages/AdminLogin";
import AdminCreateAcct from "./pages/AdminCreateAcct";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route element={<Mainlayout />}>
          <Route index element={<AdminLogin />}></Route>
          <Route
            path="/admin/account/create-account"
            element={<AdminCreateAcct />}
          ></Route>
          <Route
            path="/admin/upload-product/12345"
            element={<UploadProduct />}
          ></Route>
        </Route>
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};

export default App;
