import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown';
import { getSavedRecipeDetails } from "@/utils/save";
import PropTypes from 'prop-types'

import "./SavedDetails.css";

export default function SavedDetails ({ recipeId }){
    const [contents, setContents] = useState('');
    useEffect(() => {
        if(recipeId) getSavedRecipeDetails(recipeId).then(res => {
            setContents(res.contents);
        })
    }, [recipeId])
    return(
        <div className="saved-details">
            {contents && <div className="saved-details-box"><ReactMarkdown>{contents}</ReactMarkdown></div>}
        </div>
    )
}
SavedDetails.propTypes = {
    recipeId: PropTypes.number,
    height: PropTypes.number
}