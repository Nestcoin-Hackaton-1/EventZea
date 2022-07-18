import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: true,
};

export const Sidebar = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    changeNav: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeNav } = Sidebar.actions;

export default Sidebar.reducer;
