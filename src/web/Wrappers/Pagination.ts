export type PaginationParams = {
    page: number;
    pagesize: number;
};

export type PaginationResult<T> = {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
};
