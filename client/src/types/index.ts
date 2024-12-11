export interface User {
    id: string;
    username: string;
    role: 'admin' | 'security';
}

export interface Visitor {
    id: string;
    name: string;
    mobile: string;
    govt_id: string;
    purpose: string;
    check_in?: Date;
    check_out?: Date;
    qr_code?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<User>;
    logout: () => void;
}

export interface FilterOptions {
    dateFrom: string;
    dateTo: string;
    status: 'all' | 'checked-in' | 'checked-out';
    searchTerm: string;
} 