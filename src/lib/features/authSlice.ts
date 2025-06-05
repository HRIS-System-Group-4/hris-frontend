import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: {
        email: string;
        id: string;
        is_admin: boolean;
        name: string;
    } | null;
}

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<any>) {
            const userFromPayload = action.payload;
            state.user = {
                id: userFromPayload.id,
                email: userFromPayload.email,
                name: userFromPayload.name,
                is_admin: Boolean(userFromPayload.is_admin), 
            };
        },
        logout(state) {
            state.user = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;