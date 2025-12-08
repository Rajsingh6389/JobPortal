import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, signupApi } from "../api/authApi";
import { getProfileApi, updateProfileApi } from "../api/profileApi";

/* ===========================
    LOGIN
=========================== */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      return res.data; // token, userId, name, email, userType
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

/* ===========================
    FETCH PROFILE (Correct place to load Premium)
=========================== */
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfileApi();
      return res.data; // contains paymentStatus
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch profile" });
    }
  }
);

/* ===========================
    UPDATE PROFILE
=========================== */
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

/* ===========================
    SIGNUP
=========================== */
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

/* ===========================
    AUTH SLICE
=========================== */
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loggedIn: !!localStorage.getItem("token"),
    loading: false,
    error: "",
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loggedIn = false;
      localStorage.clear();
    },

    // Instant premium update after payment success (optional)
    upgradeToPremium: (state) => {
      if (!state.user) return;
      state.user.paymentStatus = true;
      state.user.isPremium = true;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },

  extraReducers: (builder) => {
    builder
      /* -------------------------
         LOGIN
      --------------------------*/
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        // initial login user object
        const userData = {
          id: action.payload.userId,
          name: action.payload.name,
          email: action.payload.email,
          userType: action.payload.userType,
          paymentStatus: false, // will update on fetchProfile()
          isPremium: false,
        };

        state.user = userData;
        state.token = action.payload.token;
        state.loggedIn = true;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(userData));
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      /* -------------------------
         SIGNUP
      --------------------------*/
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })

      /* -------------------------
         FETCH PROFILE → Premium Mapping
      --------------------------*/
      .addCase(fetchProfile.fulfilled, (state, action) => {
        const profile = action.payload;

        // mapping backend → redux
        profile.isPremium = !!profile.paymentStatus;

        state.user = profile;
        state.loggedIn = true;

        localStorage.setItem("user", JSON.stringify(profile));
      })

      /* -------------------------
         UPDATE PROFILE
      --------------------------*/
      .addCase(updateProfile.fulfilled, (state, action) => {
        const profile = action.payload;

        profile.isPremium = !!profile.paymentStatus;

        state.user = profile;

        localStorage.setItem("user", JSON.stringify(profile));
      });
  },
});

export const { logout, upgradeToPremium } = authSlice.actions;
export default authSlice.reducer;
