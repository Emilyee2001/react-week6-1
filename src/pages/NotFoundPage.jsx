import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function NotFoundPage() {

  const [timer, setTimer] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
  // 這裡求助GPT
    if (timer === 0) {
      navigate("/");
      return;
    }
    const intervalId = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, navigate]);
  //

  return (<>
    <div className="container-fluid bg-gray-50" style={{ height: '100vh' }}>
      <div className="text-center py-5">
        <h1 className="mb-2">此頁面不存在</h1>
        <h4>{timer} 秒後自動導回首頁</h4>
      </div>
    </div>
  </>)
}