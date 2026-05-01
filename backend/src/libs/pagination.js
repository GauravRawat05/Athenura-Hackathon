/**
  pagination.js
  Shared pagination helpers for parsing query params and building standard paginated API responses.
 */

export const parsePaginationParams = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export default parsePaginationParams;