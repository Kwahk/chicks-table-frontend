import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getScrap } from "@/api/scrap";
import PropTypes from "prop-types";

import "./SavedDetails.css";

export default function SavedDetails({ recipeId }) {
  const [contents, setContents] = useState("");
  useEffect(() => {
    if (recipeId)
      getScrap(recipeId).then((res) => {
        setContents(res.contents);
      });
  }, [recipeId]);
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
