import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CookingMethod.css";
import { getRecipeDetail } from "@/api/recipe";

const CookingMethod = () => {
  const { id } = useParams(); // URL에서 RCP_NM (레시피 이름)을 가져옴
  const [steps, setSteps] = useState([]); // 조리 과정 목록 ({ order, text, image })
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // API를 통해 조리 방법 정보를 가져오는 함수
  const fetchCookingMethod = async () => {
    try {
      const recipe = await getRecipeDetail(id);
      setSteps(recipe ? recipe.steps : []); // 조리 과정을 상태로 설정
      setLoading(false); // 로딩 완료
    } catch (error) {
      console.error("조리 방법 정보를 불러오는데 실패했습니다.", error);
      setLoading(false); // 에러 시에도 로딩 종료
    }
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchCookingMethod();
  }, [id]);

  if (loading) return <p>Loading...</p>; // 로딩 중일 때 표시

  // 조리 방법과 이미지를 순서대로 출력
  const renderCookingSteps = () =>
    steps.map((step) => (
      <div key={step.order} className="cooking-step">
        {step.image ? (
          <img
            src={step.image}
            alt={`조리 방법 ${step.order} 이미지`}
            className="cooking-img"
          />
        ) : (
          <p>이미지가 없습니다.</p> // 이미지가 없는 경우 표시할 텍스트
        )}
        <p className="cooking-text">{step.text}</p>
      </div>
    ));

  return (
    <div className="cooking-method-container">
      <div className="method-title">조리 방법</div>
      <div className="cooking-steps">{renderCookingSteps()}</div>
    </div>
  );
};

export default CookingMethod;
