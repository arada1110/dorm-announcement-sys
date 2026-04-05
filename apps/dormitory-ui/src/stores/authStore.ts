import { defineStore } from "pinia";

interface IUserPayload {
    sub: string;
    email: string;
    role: string;
    roomId?: string;
    dormitoryId?: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    status?: string;
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem("token") || "",
        user: null as IUserPayload | null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,

        role: (state) => state.user?.role,

        roomId: (state) => state.user?.roomId,

        fullName: (state) => (state.user ? `${state.user.first_name} ${state.user.last_name}` : ""),
    },

    actions: {
        setToken(token: string) {
            this.token = token;
            localStorage.setItem("token", token);

            this.decodeToken();
        },

        logout() {
            this.token = "";
            this.user = null;

            localStorage.removeItem("token");
            localStorage.removeItem("role");
        },

        decodeToken() {
            if (!this.token) return;

            try {
                const payload = JSON.parse(atob(this.token.split(".")[1]));

                this.user = payload;
            } catch (err) {
                console.error("Invalid token");
            }
        },

        initialize() {
            if (this.token) {
                this.decodeToken();
            }
        },
    },
});
