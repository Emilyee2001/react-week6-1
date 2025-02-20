import { createHashRouter } from "react-router";
import FrontLayout from "../Layouts/FrontLayout";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import NotFoundPage from "../pages/NotFoundPage";


const router = createHashRouter([
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'products',
        element: <ProductListPage />
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />
      },
      {
        path: 'cart',
        element: <CartPage />
      }
    ]
  },
  {
    path:'*',
    element: <NotFoundPage />
  }
]);

export default router;