export interface FilterState {
    search: string;
    department: string;
    level: string[];
    minPrice: string;
    maxPrice: string;
    sortBy: string;
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}
