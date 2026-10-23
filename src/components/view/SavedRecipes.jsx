import SavedSidebar from '@/components/saved/SavedSidebar';
import SavedDetails from '@/components/saved/SavedDetails';
import './SavedRecipes.css';
import { useEffect, useState } from 'react';

const SavedRecipes = () => {
  const [recipeId, setRecipeId] = useState();
  const [height, setHeight] = useState(window.innerHeight - 60);
  const updateHeight = () => setHeight(window.innerHeight - 60);
  useEffect(() => {
    window.addEventListener('resize', updateHeight);
  })
  return (
    <div className='saved-recipes-page'>
      <div className='saved-sidebar-container'>
        <SavedSidebar setRecipeId={setRecipeId} height={height}/>
      </div>
      <div className='saved-details-container'  style={{height: height}}>
        {recipeId && <SavedDetails recipeId={recipeId}/>}
      </div>
    </div>
  );
};

export default SavedRecipes;