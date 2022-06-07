/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

interface CommonReduxState {
  darkMode: boolean;
  scrollUp: boolean;
}

const name = 'common';

const initialState: CommonReduxState = {
  darkMode: false,
  scrollUp: false,
};

const reducers = {
  set_darkMode(state: CommonReduxState) {
    state.darkMode = true;
  },
  set_lightMode(state: CommonReduxState) {
    state.darkMode = false;
  },
  toggle_darkMode(state: CommonReduxState) {
    state.darkMode = !state.darkMode;
  },
  set_scrollUp(state: CommonReduxState) {
    state.scrollUp = true;
  },
  set_scrollDown(state: CommonReduxState) {
    state.scrollUp = false;
  },
};

const common = createSlice({
  name,
  initialState,
  reducers,
});

export const commonActions = common.actions;

export default common;
