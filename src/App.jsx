const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Modal } from "bootstrap";
import { useForm } from 'react-hook-form';
import MoonLoader from "react-spinners/MoonLoader";

function App() {

  const [productList, setProductList] = useState([]);
  const [tempProduct, setTempProduct] = useState({});
  const productModalRef = useRef(null);
  const [mainImage, setMainImage] = useState('');
  const [adjustQty, setAdjustQty] = useState(1);
  const [cartList, setCartList] = useState({});
  const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


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

  const getCartList = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/cart`);
      setCartList(res.data.data);
    } catch (error) {
      handleResultMessage('error', '頁面異常請稍後再試', 'center');
    }
  }

  useEffect(() => {
    getProducts();
    getCartList();
    new Modal(productModalRef.current, { backdrop: true });
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };
  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const handleOpenModal = (product) => {
    setTempProduct(product);
    setMainImage('');
    setAdjustQty(1);
    openModal();
  };

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
      getCartList();
      closeModal();
    } catch (error) {
      handleResultMessage('error', error.response.data.message, 'center');
    } finally {
      setIsLoading(false);
    }
  }

  // 調整購物車數量
  const changeCartQty = async (cart, qty) => {
    setIsLoading(true);
    const { id, product_id } = cart;
    try {
      await axios.put(`${baseUrl}/v2/api/${apiPath}/cart/${id}`, {
        data: {
          product_id,
          qty: Number(qty),
        }
      });
      getCartList();
    } catch (error) {
      handleResultMessage('error', '系統異常請稍後再試', 'center');
    } finally {
      setIsLoading(false);
    }
  }

  // 刪除單一購物車
  const deleteCart = async (cartId) => {
    setIsFullscreenLoading(true);
    try {
      await axios.delete(`${baseUrl}/v2/api/${apiPath}/cart/${cartId}`);
      getCartList();
    } catch (error) {
      handleResultMessage('error', error.response.data.message, 'center');
    } finally {
      setIsFullscreenLoading(false);
    }
  }

  // 刪除全部購物車
  const deleteAllCart = async () => {
    setIsFullscreenLoading(true);
    try {
      await axios.delete(`${baseUrl}/v2/api/${apiPath}/carts`);
      getCartList();
    } catch (error) {
      handleResultMessage('error', error.response.data.message, 'center');
    } finally {
      setIsFullscreenLoading(false);
    }
  };

  const handleDeleteAllCart = () => {
    Swal.fire({
      text: "確認刪除全部？",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "刪除"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAllCart();
      }
    });
  };

  // 表單處理
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = handleSubmit(data => {
    const { message, ...user } = data;
    const userInfo = {
      user,
      message
    }
    checkout(userInfo);
  })

  const checkout = async (data) => {
    setIsFullscreenLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/order`, {
        data
      });
      handleResultMessage('success', res.data.message, 'center');
      getCartList();
      reset();
    } catch (error) {
      handleResultMessage('error', error.response.data.message, 'center');
    } finally {
      setIsFullscreenLoading(false);
    }
  }

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
                <a onClick={(e) => { e.preventDefault(); handleOpenModal(product) }}
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
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

    {/* 商品modal */}
    <div className="modal fade" ref={productModalRef} id="productModal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id="productModal">商品說明</h2>
            <button onClick={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
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
          </div>
        </div>
      </div>
    </div>

    {/* 購物車 */}
    <div className="container py-5">
      <div className="row">
        <h3 className='text-center'>購物車</h3>
        {cartList.carts?.length == 0 ? (
          <div className='bg-gray-50 py-5 my-3'>
            <p className='fs-5 text-center'>購物車沒有東西</p>
          </div>
        ) : (<>
          <div className="text-end py-3">
            <button
              onClick={handleDeleteAllCart}
              className="btn btn-outline-primary rounded-0" type="button">
              清空購物車
            </button>
          </div>
          <table className="table align-middle">
            <thead className='table-primary'>
              <tr className='text-center'>
                <th></th>
                <th>品名</th>
                <th>單價</th>
                <th style={{ width: "180px" }}>數量</th>
                <th>小記</th>
              </tr>
            </thead>

            <tbody>
              {cartList.carts?.map(cart => (
                <tr key={cart.id} className='text-center'>
                  <td>
                    <button onClick={() => { deleteCart(cart.id) }} type="button" className="btn btn-primary rounded-0 btn-sm">
                      刪除
                    </button>
                  </td>
                  <td>
                    {cart.product.title}</td>
                  <td>{cart.product.price}</td>
                  <td style={{ width: "150px" }}>
                    <div className="d-flex align-items-center">
                      <div className="btn-group me-2 w-100" role="group">
                        <button
                          disabled={cart.qty == 1 || isLoading}
                          onClick={() => { changeCartQty(cart, cart.qty - 1) }}
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                        >
                          -
                        </button>
                        <div
                          className="btn border border-dark w-50"
                          style={{ cursor: "auto" }}
                        >{cart.qty}</div>
                        <button
                          disabled={cart.qty >= 10 || isLoading}
                          onClick={() => { changeCartQty(cart, cart.qty + 1) }}
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>NTD {cart.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className='fs-lg'>
                <td colSpan="4" className="text-end">總計</td>
                <td className='text-center'>NTD {cartList.final_total}</td>
              </tr>
            </tfoot>
          </table>
        </>)}
      </div>
    </div>

    {/* 表單 */}
    {cartList.carts?.length !== 0 && (<>
      <div className="container py-5">
        <div className="row">
          <h3 className='text-center'>訂購人資料</h3>
          <div className="my-5 row justify-content-center">
            <form onSubmit={onSubmit} className="col-md-6">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  {...register('email', {
                    required: '此欄位必填',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Email格式錯誤',
                    }
                  })}
                  id="email"
                  type="text"
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  placeholder="請輸入 Email"
                />

                {errors.email && (<p className="text-danger my-2 fs-sm">{errors.email?.message}</p>)}

              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  收件人姓名
                </label>
                <input
                  {...register('name', {
                    required: '此欄位必填',
                  })}
                  id="name"
                  type='text'
                  className={`form-control ${errors.name && 'is-invalid'}`}
                  placeholder="請輸入姓名"
                />

                {errors.name && (<p className="text-danger my-2 fs-sm">{errors.name?.message}</p>)}
              </div>

              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  收件人電話
                </label>
                <input
                  {...register('tel', {
                    required: '此欄位必填',
                    pattern: {
                      value: /^(0[2-8]\d{7}|09\d{8})$/,
                      message: '資料格式有誤',
                    }
                  })}
                  id="tel"
                  type="tel"
                  className={`form-control ${errors.tel && 'is-invalid'}`}
                  placeholder="請輸入電話"
                />

                {errors.tel && (<p className="text-danger my-2 fs-sm">{errors.tel?.message}</p>)}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  收件人地址
                </label>
                <input
                  {...register('address', {
                    required: '此欄位必填'
                  })}
                  id="address"
                  type="text"
                  className={`form-control ${errors.address && 'is-invalid'}`}
                  placeholder="請輸入地址"
                />
                {errors.address && (<p className="text-danger my-2 fs-sm">{errors.address?.message}</p>)}
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  留言
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  className="form-control"
                  cols="30"
                  rows="5"
                ></textarea>
              </div>
              <div className="text-end">
                <button type="submit" className="btn btn-primary rounded-0">
                  送出訂單
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>)}

    {/* fullscreen Loading */}
    {isFullscreenLoading && (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.5)",
          zIndex: 999,
        }}
      >
        <MoonLoader type="spin" color='#b23c24' width="4rem" height="4rem" />
      </div>

    )}



  </>)
}

export default App
