function parsePagination(query = {}) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset
  };
}

function buildPaginationMeta(count, page, limit) {
  const totalItems = Number(count) || 0;
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

  return {
    page,
    limit,
    total_items: totalItems,
    total_pages: totalPages
  };
}

module.exports = {
  parsePagination,
  buildPaginationMeta
};

