const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

import axios from 'axios';
import { useEffect, useState } from 'react';
import FullscreenLoading from '../components/FullscreenLoading';
import { useParams } from 'react-router';

export default function ProductDetailPage() {

  const [tempProduct, setTempProduct] = useState({});
  const [mainImage, setMainImage] = useState('');
  const [adjustQty, setAdjustQty] = useState(1);
  const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id: product_id } = useParams();

  const getProduct = async () => {
    setIsFullscreenLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/product/${product_id}`);
      setTempProduct(res.data.product);
    } catch (error) {
      handleResultMessage('error', '頁面異常請稍後再試', 'center');
    } finally {
      setIsFullscreenLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  // 加入購物車
  const addCart = async (product_id, qty) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        }
      })
      handleResultMessage('success', res.data.message, 'top-end');
    } catch (error) {
      handleResultMessage('error', error.response.data.message, 'center');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultMessage = (icon, message, position) => {
    Swal.fire({
      position: position,
      icon: icon,
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  return (<>
    <div className="container py-3">
      <div className="row">
        <div className="col-1">
          <a onClick={(e) => { e.preventDefault(); setMainImage(tempProduct.imageUrl) }}
            className='mb-2'>
            <img className='product-card-img' src={tempProduct.imageUrl} alt={tempProduct.title} />
          </a>
          {tempProduct.imagesUrl?.map(image => (
            <a onClick={(e) => { e.preventDefault(); setMainImage(image) }}
              key={image} className='mb-2'>
              <img className='product-card-img' src={image} alt={tempProduct.title} />
            </a>
          ))}
        </div>
        <div className="col-6">
          <img className='product-card-img' src={!mainImage ? tempProduct.imageUrl : mainImage} alt={tempProduct.title} />
        </div>
        <div className="col-5">
          <section className='border-bottom border-gray-200 mb-4'>
            <h2 className='text-primary mb-3'>{tempProduct.title}</h2>
            <ul className='mb-2 fs-lg'>
              <li>成分：100%{tempProduct.title}</li>
              <li>類別：{tempProduct.category}</li>
              <li>有效期限：標示於包裝上</li>
            </ul>
            <p className='mb-4'>{tempProduct.description}</p>
          </section>
          <section className='my-4'>
            <p className='fs-lg fw-semibold mb-2'>規格</p>
            <input type="radio" className="btn-check" name="productContent" id="btnradio1" autoComplete="off" defaultChecked />
            <label className="btn btn-secondary-outlined py-2 px-4 me-2 fs-lg" htmlFor="btnradio1">{tempProduct.content}/罐</label>

            <input type="radio" className="btn-check" name="productContent" id="btnradio2" autoComplete="off" disabled />
            <label className="btn btn-secondary-outlined py-2 px-4 me-2 fs-lg fw-semibold" htmlFor="btnradio2">商用500公克/袋</label>
          </section>
          <div>
            <p className='fs-5 text-secondary fw-bold mb-4'>NT$ {tempProduct.price}</p>
            <div className="btn-group w-100 mb-4" role="group" aria-label="Basic outlined">
              <button
                onClick={() => { setAdjustQty(adjustQty - 1) }}
                disabled={adjustQty == 1}
                type="button"
                className='btn btn-outline-gray-200 text-gray-950 rounded-0'
              >-</button>
              <div
                style={{ width: '80%' }}
                className="btn border border-gray-200">{adjustQty}</div>
              <button
                onClick={() => { setAdjustQty(adjustQty + 1) }}
                disabled={adjustQty == 10}
                type="button"
                className='btn btn-outline-gray-200 text-gray-950 rounded-0'
              >+</button>
            </div>
            <button
              onClick={() => { addCart(tempProduct.id, adjustQty) }}
              type='button' className='btn btn-primary w-100 rounded-0 fw-semibold'
            >{isLoading ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>) : '加入購物車'}
            </button>
          </div>
        </div>
      </div>
    </div>

    {isFullscreenLoading && <FullscreenLoading />}

  </>)
}