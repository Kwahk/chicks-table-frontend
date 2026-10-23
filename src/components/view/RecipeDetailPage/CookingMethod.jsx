import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CookingMethod.css';

const API_KEY = '9b31d1ae298a4fa49c49'; // API Key

const CookingMethod = () => {
  const { id } = useParams(); // URL에서 RCP_NM (레시피 이름)을 가져옴
  const [recipe, setRecipe] = useState({}); // 전체 레시피 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // API를 통해 조리 방법 정보를 가져오는 함수
  const fetchCookingMethod = async () => {
    try {
      const response = await fetch(
        `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/xml/1/1/RCP_NM=${encodeURIComponent(id)}`
      );
      const xmlData = await response.text(); // XML 데이터를 텍스트로 받아옴
  
      // XML 데이터를 파싱하는 함수
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlData, 'application/xml');
  
      // XML에서 필요한 데이터 추출 (조리 방법 관련 데이터 가져오기)
      const row = xml.getElementsByTagName('row')[0]; // 해당 레시피의 row
      if (!row) {
        throw new Error("조리 방법을 찾을 수 없습니다.");
      }

      // 설명과 이미지 데이터를 최대 20번까지 가져오기
      const recipeData = {};
      for (let i = 1; i <= 20; i++) {
        const manual = row.getElementsByTagName(`MANUAL0${i}`)[0]?.textContent || null;
        const manualImg = row.getElementsByTagName(`MANUAL_IMG0${i}`)[0]?.textContent || null;
        
        if (manual) {
          recipeData[`MANUAL0${i}`] = manual;
        }
        if (manualImg) {
          recipeData[`MANUAL_IMG0${i}`] = manualImg;
        }
      }

      setRecipe(recipeData); // 레시피 정보를 상태로 설정
      setLoading(false); // 로딩 완료
    } catch (error) {
      console.error('조리 방법 정보를 불러오는데 실패했습니다.', error);
      setLoading(false); // 에러 시에도 로딩 종료
    }
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchCookingMethod();
  }, [id]);

  if (loading) return <p>Loading...</p>; // 로딩 중일 때 표시

  // 조리 방법과 이미지를 순서대로 출력
  const renderCookingSteps = () => {
    const steps = [];
    for (let i = 1; i <= 20; i++) {
      const manual = recipe[`MANUAL0${i}`];
      const manualImg = recipe[`MANUAL_IMG0${i}`];

      if (manual) {
        steps.push(
          <div key={i} className="cooking-step">
            {manualImg ? (
              <img src={manualImg} alt={`조리 방법 ${i} 이미지`} className="cooking-img" />
            ) : (
              <p>이미지가 없습니다.</p> // 이미지가 없는 경우 표시할 텍스트
            )}
            <p className="cooking-text">{manual}</p>
          </div>
        );
      }
    }
    return steps;
  };

  return (
    <div className='cooking-method-container'>
      <div className='method-title'>조리 방법</div>
      <div className="cooking-steps">
        {renderCookingSteps()}
      </div>
    </div>
  );
};

export default CookingMethod;
