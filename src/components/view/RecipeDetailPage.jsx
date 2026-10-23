import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CookingMethod from '../view/RecipeDetailPage/CookingMethod';
import './RecipeDetailPage.css';

const API_KEY = '9b31d1ae298a4fa49c49'; // API Key

const RecipeDetailPage = () => {
  const { id } = useParams(); // URL에서 RCP_NM (레시피 이름)을 가져옴
  const [recipe, setRecipe] = useState(null); // 선택된 레시피 정보를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // API를 통해 레시피 상세 정보를 가져오는 함수
  const fetchRecipeDetails = async () => {
    try {
      const response = await fetch(
        `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/xml/1/1/RCP_NM=${encodeURIComponent(id)}`
      );
      const xmlData = await response.text(); // XML 데이터를 텍스트로 받아옴
  
      // XML 데이터를 파싱하는 함수
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlData, 'application/xml');
  
      // XML에서 필요한 데이터 추출
      const row = xml.getElementsByTagName('row')[0]; // 해당 레시피의 row
      if (!row) {
        throw new Error("레시피를 찾을 수 없습니다.");
      }
  
      const recipeData = {
        RCP_SEQ: row.getElementsByTagName('RCP_SEQ')[0].textContent,
        RCP_NM: row.getElementsByTagName('RCP_NM')[0].textContent,
        RCP_PAT2: row.getElementsByTagName('RCP_PAT2')[0].textContent,
        ATT_FILE_NO_MK: row.getElementsByTagName('ATT_FILE_NO_MK')[0]?.textContent, // 변경된 이미지 소스
        RCP_PARTS_DTLS: row.getElementsByTagName('RCP_PARTS_DTLS')[0]?.textContent, // 재료 정보
        INFO_ENG: row.getElementsByTagName('INFO_ENG')[0]?.textContent || 'N/A', // 열량
        INFO_CAR: row.getElementsByTagName('INFO_CAR')[0]?.textContent || 'N/A', // 탄수화물
        INFO_PRO: row.getElementsByTagName('INFO_PRO')[0]?.textContent || 'N/A', // 단백질
        INFO_FAT: row.getElementsByTagName('INFO_FAT')[0]?.textContent || 'N/A', // 지방
      };
  
      setRecipe(recipeData); // 상세 레시피 정보 상태에 저장
      setLoading(false); // 로딩 완료
    } catch (error) {
      console.error('레시피 상세 정보를 불러오는데 실패했습니다.', error);
      setLoading(false); // 에러 시에도 로딩 종료
    }
  };
  
  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  if (loading) return <p className='p-tag'>로딩 중...</p>; // 로딩 중일 때 표시

  if (!recipe) return <p className='p-tag'>레시피를 찾을 수 없습니다.</p>;

  return (
    <div className='recipe-container'>
      <div className="recipe-info1">
        <div className="recipe-name1">{recipe.RCP_NM}</div>
        <div className="recipe-category1">분류 &gt; <span className='category-bold1'>{recipe.RCP_PAT2}</span></div>
      </div>
      <div className="image-container">
        <img src={recipe.ATT_FILE_NO_MK} alt={recipe.RCP_NM} className="recipe-img1"/>
      </div>
      <div className='material-container'>
        <div className='material-title'>재료 정보</div>
        <div className='material-text'>{recipe.RCP_PARTS_DTLS || '재료 정보가 없습니다.'}</div>
      </div>

      <CookingMethod />

      {/* 영양 성분 테이블 추가 */}
      <div className='nutrition-container'>
        <div className='nutrition-title'>영양 성분</div>
        <table className='nutrition-table'>
          <thead>
            <tr>
              <th>열량</th>
              <th>탄수화물</th>
              <th>단백질</th>
              <th>지방</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{recipe.INFO_ENG} kcal</td>
              <td>{recipe.INFO_CAR} g</td>
              <td>{recipe.INFO_PRO} g</td>
              <td>{recipe.INFO_FAT} g</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
