import { configureStore } from '@reduxjs/toolkit';
import { HYDRATE, createWrapper, MakeStore } from 'next-redux-wrapper';
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux';
import { combineReducers, Store, AnyAction } from 'redux';
import logger from 'redux-logger';

import common from '@store/common';

const rootReducer = combineReducers({
  commmon: common.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

let initialRootState: RootState;

const reducer = (state: any, action: AnyAction) => {
  if (action.type === HYDRATE) {
    if (state === initialRootState) {
      return {
        ...state,
        ...action.payload,
      };
    }
    return state;
  }

  return rootReducer(state, action);
};

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

const initStore: MakeStore<Store> = () => {
  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
    devTools: true,
  });
  initialRootState = store.getState();
  return store;
};

export const wrapper = createWrapper(initStore);
