export interface Category {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryPagination {
    currentPage: number;
    totalPages: number;
    totalData: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface CategoriesResponse {
    data: Category[];
    pagination: CategoryPagination;
}
