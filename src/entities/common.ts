export interface PaginationQuery {
  limit?: number;
  skip?: number;
}

export interface Pagination<T> {
  total: number;
  data: T[];
}
