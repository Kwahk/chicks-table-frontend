import ReactMarkdown from "react-markdown";
import { useScrap } from "@/hooks/scrap";
import PropTypes from "prop-types";

import "./SavedDetails.css";

export default function SavedDetails({ recipeId }) {
  const { data: scrap, isLoading, isError } = useScrap(recipeId);
  const contents = scrap?.contents;

  if (isLoading) return <div className="saved-details">불러오는 중...</div>;
  if (isError)
    return <div className="saved-details">레시피를 불러오지 못했습니다.</div>;
  return (
    <div className="saved-details">
      {contents && (
        <div className="saved-details-box">
          <ReactMarkdown>{contents}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
SavedDetails.propTypes = {
  recipeId: PropTypes.number,
  height: PropTypes.number,
};
