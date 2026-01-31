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
import { AppContextProvider } from "./context/AppContextProvider";
import AdminDashboard from "./pages/AdminDashboard";
import AllProducts from "./pages/AllProducts";
import ProductInfo from "./pages/ProductInfo";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          element={
            <AppContextProvider>
              <Mainlayout />
            </AppContextProvider>
          }
        >
          <Route index element={<AdminLogin />}></Route>
          <Route
            path="/admin/account/create-account"
            element={<AdminCreateAcct />}
          ></Route>
          <Route
            path="/admin/upload-product"
            element={<UploadProduct />}
          ></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
          <Route path="/admin/products" element={<AllProducts />}></Route>
          <Route
            path="/admin/product-info/:id"
            element={<ProductInfo />}
          ></Route>
        </Route>
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};

export default App;
