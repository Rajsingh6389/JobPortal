import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, signupApi } from "../api/authApi";
import { getProfileApi, updateProfileApi } from "../api/profileApi";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

// FETCH PROFILE (AFTER LOGIN OR REFRESH)
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfileApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch profile" });
    }
  }
);

// UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateProfileApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Update failed" });
    }
  }
);

// SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signupApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Signup failed" });
    }
  }
);

// AUTH SLICE
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    userType: localStorage.getItem("userType") || null,
    loggedIn: !!localStorage.getItem("token"),
    loading: false,
    error: "",
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userType = null;
      state.loggedIn = false;
      localStorage.clear();
    },

    // 🔥 Only for instant UI update after payment success
    upgradeToPremium: (state) => {
      if (!state.user) return;
      state.user.isPremium = true;
      state.user.paymentStatus = true;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        // Basic login data
        const userData = {
          id: action.payload.userId,
          name: action.payload.name,
          email: action.payload.email,
          userType: action.payload.userType,
        };

        // Premium status MUST come from DB profile (fetchProfile)
        userData.isPremium = false;

        state.user = userData;
        state.token = action.payload.token;
        state.userType = action.payload.userType;
        state.loggedIn = true;

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userType", action.payload.userType);
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Signup failed";
      })

      // 🌟 FETCH PROFILE — ALWAYS SYNC PREMIUM STATUS
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;

        // 🔥 IMPORTANT: Always map DB → Redux
        state.user.isPremium = !!action.payload.paymentStatus;

        state.userType = action.payload.userType;

        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("userType", state.userType);
      })

      // UPDATE PROFILE
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;

        state.user.isPremium = !!action.payload.paymentStatus;

        if (action.payload.userType) {
          state.userType = action.payload.userType;
          localStorage.setItem("userType", action.payload.userType);
        }

        localStorage.setItem("user", JSON.stringify(state.user));
      });
  },
});

export const { logout, upgradeToPremium } = authSlice.actions;
export default authSlice.reducer;
