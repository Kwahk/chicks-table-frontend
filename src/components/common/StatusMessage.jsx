import PropTypes from "prop-types";

// 로딩, 에러, 빈 결과처럼 데이터 대신 보여줄 안내 문구
const StatusMessage = ({ message, onRetry, className = "no-results" }) => (
  <div className={className}>
    {message}
    {onRetry && (
      <>
        {" "}
        <button onClick={onRetry}>다시 시도</button>
      </>
    )}
  </div>
);
StatusMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  className: PropTypes.string,
};

export default StatusMessage;
