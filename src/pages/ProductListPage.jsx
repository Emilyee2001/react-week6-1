const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

import { Link } from 'react-router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import FullscreenLoading from '../components/FullscreenLoading';

export default function ProductListPage() {

  const [productList, setProductList] = useState([]);
  const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);


  const getProducts = async () => {
    setIsFullscreenLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/products/all`);
      setProductList(res.data.products);
    } catch (error) {
      handleResultMessage('error', '頁面異常請稍後再試', 'center');
    } finally {
      setIsFullscreenLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (<>
    <div className="bg position-relative" style={{ backgroundImage: `url(https://github.com/Emilyee2001/react-week5-1/blob/main/src/assets/images/banner-4.png?raw=true)`, height: '30vh' }}>
      <h1 className="display-1 position-absolute top-50 start-50 translate-middle">產品分類</h1>
    </div>
    {/* 商品列表 */}
    <div className="container py-5">
      <div className="row">
        <section className="col-3">
          <h5>產品列表</h5>
        </section>
        <section className="col-9">
          <div className="row d-flex flex-wrap row-gap-2">
            {productList.map(product => (
              <div key={product.id} className="column">
                <Link to={`/products/${product.id}`}
                  className="card product-card btn-gray-outlined-hover">
                  <div className='position-relative'>
                    <img src={product.imageUrl} className="card-img-top product-card-img" alt={product.title} />
                    <button type="button" className='btn-gray-outlined position-absolute bottom-0 start-50 translate-middle-x mb-2'>加入購物車</button>
                  </div>
                  <div className="card-body">
                    <h6 className='mb-2 text-truncate'>{product.title}</h6>
                    <p className='mb-2'>商品內容：{product.content}</p>
                    <p className="fs-lg text-secondary-700 fw-semibold">NT$ {product.price} /罐</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

    {isFullscreenLoading &&  <FullscreenLoading /> }

  </>)
}