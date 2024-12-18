// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import userDetails from "./userdetails"; // Importing user details

const initialState = {
  isAuthenticated: false,
  currentUser: null,
  error: null,
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
        console.log(user);
        state.currentUser = user; // Save the full user object, including username
      } else {
        state.isAuthenticated = false;
        state.currentUser = null;
        state.error = "Invalid email/phone or password";
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.error = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
