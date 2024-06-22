import { createSlice } from "@reduxjs/toolkit";
import {
  clearLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "../../utils/localStorage";

const initialState = {
  id: getLocalStorage()?.id,
  profile_picture: getLocalStorage()?.profile_picture,
  name: getLocalStorage()?.name,
  role: getLocalStorage()?.role,
  jwt: getLocalStorage()?.jwt,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setData: (state, action) => {
      setLocalStorage({
        id: action.payload.id,
        profile_picture: action.payload.profile_picture,
        name: action.payload.name,
        role: action.payload.role,
        jwt: action.payload.jwt,
      });
      state.id = action.payload.id;
      state.profile_picture = action.payload.profile_picture;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.jwt = action.payload.jwt;
    },
    updateData: (state, action) => {
      const { id, profile_picture, name, role, jwt } = action.payload;
      // Update only the fields that are provided in the action payload
      if (id !== undefined) state.id = id;
      if (profile_picture !== undefined)
        state.profile_picture = profile_picture;
      if (name !== undefined) state.name = name;
      if (role !== undefined) state.role = role;
      if (jwt !== undefined) state.jwt = jwt;

      // Update the corresponding fields in localStorage
      setLocalStorage({
        id: state.id,
        profile_picture: state.profile_picture,
        name: state.name,
        role: state.role,
        jwt: state.jwt,
      });
    },

    clearData: (state) => {
      clearLocalStorage();
      state.id = undefined;
      state.profile_picture = undefined;
      state.name = undefined;
      state.role = undefined;
      state.jwt = undefined;
    },
  },
});

export const { setData, clearData, updateData } = userSlice.actions;

export default userSlice.reducer;
