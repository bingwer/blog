/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

interface CommonReduxState {
  darkMode: boolean;
  searchMode: boolean;
  scrollUp: boolean;
}

const name = 'common';

const initialState: CommonReduxState = {
  darkMode: false,
  searchMode: false,
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
  set_searchMode(state: CommonReduxState) {
    state.searchMode = true;
  },
  set_nonSearchMode(state: CommonReduxState) {
    state.searchMode = false;
  },
  toggle_searchMode(state: CommonReduxState) {
    state.searchMode = !state.searchMode;
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
