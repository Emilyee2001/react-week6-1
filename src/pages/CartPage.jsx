const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FullscreenLoading from '../components/FullscreenLoading';

export default function CartPage() {

  const [cartList, setCartList] = useState({});
  const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getCartList = async () => {
    setIsFullscreenLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/cart`);
      setCartList(res.data.data);
    } catch (error) {
      handleResultMessage('error', '頁面異常請稍後再試', 'center');
    } finally {
      setIsFullscreenLoading(false);
    }
  };

  useEffect(() => {
    getCartList();
  }, []);

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
    <div className="bg position-relative" style={{ backgroundImage: `url(https://github.com/Emilyee2001/react-week5-1/blob/main/src/assets/images/banner-4.png?raw=true)`, height: '30vh' }}>
      <h1 className="display-1 position-absolute top-50 start-50 translate-middle">購物車</h1>
    </div>
    {/* 購物車 */}
    <div className="container py-5">
      <div className="row">
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

    {isFullscreenLoading && <FullscreenLoading />}

  </>)
}