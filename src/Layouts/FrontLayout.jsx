import { Link, NavLink, Outlet } from "react-router"

export default function FrontLayout() {

  const navRoutes = [
    {
      path: '/about',
      name: '關於我們',
    },
    {
      path: '/products',
      name: '產品分類',
    },
    {
      path: '/cart',
      name: '購物車',
    }
  ]

  return (<>
    <header>
      <div className="bg-primary-800">
        <div className="container">
          <p className="text-center text-white py-2">周年慶！滿千送百，精美小禮加碼送 ～</p>
        </div>
      </div>
      <nav className="container py-3">
        <div className="d-flex gap-5 align-items-center">
          <Link to="/">
            <img src="https://github.com/Emilyee2001/react-week5-1/blob/main/src/assets/images/logo.png?raw=true" style={{ width: '190px' }} alt="logo" />
          </Link>
          <ul className="d-flex gap-4">
            {navRoutes.map(page => (
              <li key={page.path} className="fs-lg fw-semibold">
                <NavLink to={page.path}>{page.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>

    <Outlet />

    <footer className="bg-gray-50">
      <div className="container py-5">
        <div className="border-bottom border-gray-200 mb-4 d-flex justify-content-between">
          <div className="mb-4">
            <Link to="/">
              <img src="https://github.com/Emilyee2001/react-week5-1/blob/main/src/assets/images/logo.png?raw=true" style={{ width: '190px' }} alt="logo" />
            </Link>
            <p className="mt-2">地址：台北市中正區重慶南路1段122號</p>
            <p>統一編號：20245437</p>
          </div>
          <ul className="d-flex gap-4">
            {navRoutes.map(page => (
              <li key={page.path}>
                <NavLink to={page.path}>{page.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="d-flex gap-3 justify-content-center">
          <p>© 2024 ExotiSpice All Rights Reserved</p>
          <p>隱私權政策</p>
          <p>使用者條款</p>
        </div>
      </div>
    </footer>
  </>)
}