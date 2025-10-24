import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";

//Redux Persist is used to save (persist) your Redux state in a storage (like localStorage or sessionStorage), so the data doesn’t get lost when the page reloads or the browser is closed and reopened.
//Main uses:
//1.Save user login state (so the user stays logged in after refresh).
//2.Cache API data (like job listings or cart items).
//3.Improve user experience (by avoiding re-fetching or losing data).
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
   key:'root',
   version:1,
   storage,
}

//The reducer in the Redux Toolkit store is the root reducer where we write all slices and it manages how the state updates when actions are dispatched. It registers all slice reducers, updates the state based on the actions, and combines multiple slice reducers into a single root reducer
//A reducers in slice is a function that takes the current state and an action, and returns the new state.

//combineReducers → Combines multiple slices (auth, job) into one root reducer.
const rootReducer = combineReducers({
      auth:authSlice,
      job:jobSlice,
      company:companySlice,
      application: applicationSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
         },
      }),
});
export default store;