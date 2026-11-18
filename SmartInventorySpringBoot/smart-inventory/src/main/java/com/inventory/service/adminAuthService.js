import api from "./api";

const TOKEN_KEY = "adminToken";
const USER_KEY = "adminUser";

const adminAuthService = {

  async login(email, password) {
    const response = await api.post("/auth/admin/login", {
      email,
      password
    });

    const { token, ...user } = response.data;

    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
  },

  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const user = sessionStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
};

export default adminAuthService;