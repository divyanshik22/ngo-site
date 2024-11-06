import { createSlice } from "@reduxjs/toolkit";
import userDetails from "./userdetails"; // Importing user details

const initialState = {
  isAuthenticated: false,
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      const { emailOrPhone, password } = action.payload;
      const user = userDetails.find(
        (u) =>
          (u.email === emailOrPhone || u.phoneNumber === emailOrPhone) &&
          u.password === password
      );

      if (user) {
        state.isAuthenticated = true;
        state.currentUser = user;
      } else {
        state.isAuthenticated = false;
        state.currentUser = null;
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
