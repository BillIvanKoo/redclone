import React, { createContext, useReducer, useContext } from 'react';

const defaultState = {
    user: null
};

function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case "LOG_IN":
            const {user, token} = action;
            localStorage.setItem("redclone_token", token);
            return {...state, user};
        case "LOG_OUT":
            localStorage.removeItem("redclone_token");
            return {...state, user: null};
        case "UPDATE_USER":
            return {...state, user: action.user}
        default:
            return state;
    }
}

const StoreContext = createContext(null);


export const StoreProvider = ({ children }) => {
    const value = useReducer(reducer, defaultState)

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext);