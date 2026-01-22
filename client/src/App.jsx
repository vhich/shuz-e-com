import React from "react";
import {
  Routes,
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Mainlayout from "./layouts/Mainlayout";
import Homepage from "./pages/Homepage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import { AppContextProvider } from "./context/AppContent";
import CheckoutPage from "./pages/CheckoutPage";

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
          <Route index element={<Homepage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
        </Route>
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};

export default App;
