import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getUserNickname, getUserSavedList } from '@/utils/user';

import './SavedSidebar.css'; // 고유 이름을 사용한 CSS 추가
import xImage from '@/assets/x.png';

const SavedSidebar = ({ setRecipeId, height }) => {
  const [nickname, setNickname] = useState('');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState(''); // 에러 상태 추가

  // 서버에서 레시피 목록 가져오기
  useEffect(() => {
    getUserNickname().then(nickname => {
      setNickname(nickname);
    });

    getUserSavedList().then(savedList => {
      setSavedRecipes(savedList)
      setError(''); // 에러가 없으면 에러 메시지를 빈 문자열로 설정
    })
      .catch(err => {
        setError('레시피를 불러오는 도중 문제가 발생했습니다: ' + err); // 에러 발생 시 메시지 설정
        setSavedRecipes([]); // 에러 발생 시 빈 배열로 설정
      })

  }, []);

  // 스크랩 삭제 함수
  const handleDeleteClick = async (scrapId, recipeTitle) => {
    const isConfirmed = window.confirm(`"${recipeTitle}" 레시피를 삭제하시겠습니까?`);
    const BASE_URL = import.meta.env.VITE_API_URL;
    if (isConfirmed) {
      try {
        const token = localStorage.getItem('access_token');  // 토큰 이름 통일
        await axios.delete(`${BASE_URL}/scrap/${scrapId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // 삭제 성공 후 UI 업데이트
        const updatedRecipes = savedRecipes.filter(scrap => scrap.id !== scrapId);
        setSavedRecipes(updatedRecipes);
      } catch (err) {
        setError('레시피를 삭제하는 도중 문제가 발생했습니다.', err);
      }
    }
  };

  return (
    <div className="scrap-modal-content" style={{height: height}}>
      <h3>&quot;{nickname}&quot; 님의<br />저장한 레시피 목록</h3>
      {/* 에러가 있을 때만 에러 메시지를 표시 */}
      {error && (
        <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>
      )}

      <div className="scrap-recipe-list" >
        {savedRecipes && savedRecipes.length > 0 ? (
          savedRecipes.map((recipe, index) => (
            <div key={index} className="scrap-recipe-item" onClick={() => setRecipeId(recipe.id)}>
              <div>{recipe.title}</div>
              <button className="scrap-delete-recipe" onClick={() => handleDeleteClick(recipe.id, recipe.title)}>
                <img src={xImage} alt="x 아이콘" style={{ width: '10px', height: '10px' }} />
              </button>
            </div>
          ))
        ) : (
          !error && <p>저장된 레시피가 없습니다.</p>  // 데이터가 없을 경우 메시지 표시
        )}
      </div>
    </div>
  );
};
SavedSidebar.propTypes = {
  setRecipeId: PropTypes.func,
  height: PropTypes.number
}

export default SavedSidebar;
