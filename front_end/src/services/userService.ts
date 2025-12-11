import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from '../config/api';

export interface User {
    id: string;
    email: string;
    username: string;
    full_name?: string;
    created_at: string;
    is_active: boolean;
}

class UserService {
    async getCurrentUser(): Promise<User> {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users.me}`, {
            headers: {
                ...getAuthHeader(),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return await response.json();
    }

    async updateCurrentUser(userData: Partial<User>): Promise<User> {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users.update}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        return await response.json();
    }
}

export const userService = new UserService();
