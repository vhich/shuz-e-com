import React from "react";
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import UploadProduct from "./pages/UploadProduct";
import AdminLogin from "./pages/AdminLogin";
import AdminCreateAcct from "./pages/AdminCreateAcct";
import { AppContextProvider } from "./context/AppContextProvider";
import AdminDashboard from "./pages/AdminDashboard";
import AllProducts from "./pages/AllProducts";
import ProductInfo from "./pages/ProductInfo";
import AdminOrders from "./pages/AdminOrders";
import OrderDetails from "./pages/OrderDetails";
import NotificationPage from "./pages/NotificationPage";
import NotFound from "./pages/NotFound";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          element={
            <AppContextProvider>
              <MainLayout />
            </AppContextProvider>
          }
        >
          <Route index element={<AdminLogin />}></Route>
          <Route path="*" element={<NotFound />}></Route>
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
          <Route path="/admin/product/:id" element={<ProductInfo />}></Route>
          <Route path="/admin/orders" element={<AdminOrders />}></Route>
          <Route
            path="/admin/order-details?"
            element={<OrderDetails />}
          ></Route>
          <Route
            path="/admin/notifications"
            element={<NotificationPage />}
          ></Route>
        </Route>
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};

export default App;
