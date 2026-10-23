import PropTypes from "prop-types";

// 로딩, 에러, 빈 결과처럼 데이터 대신 보여줄 안내 문구
// as로 감쌀 태그를 바꿀 수 있다 (기본 div)
const StatusMessage = ({
  message,
  onRetry,
  className = "no-results",
  as: Tag = "div",
}) => (
  <Tag className={className}>
    {message}
    {onRetry && (
      <>
        {" "}
        <button onClick={onRetry}>다시 시도</button>
      </>
    )}
  </Tag>
);
StatusMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default StatusMessage;
