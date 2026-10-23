import PropTypes from "prop-types";

const Pagination = ({ currentPage, totalPages, onChange }) => (
  <div className="pagination">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
      <button
        key={number}
        onClick={() => onChange(number)}
        className={currentPage === number ? "active" : ""}
      >
        {number}
      </button>
    ))}
  </div>
);
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Pagination;
