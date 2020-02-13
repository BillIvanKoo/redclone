import React, { createContext, useReducer, useContext } from 'react';

const defaultState = {
    user: null
};

function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case "LOG_IN":
            return {...state, user: action.user};
        default:
            return state;
    }
}

const StoreContext = createContext(null);


export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);
    const value = {state, dispatch}

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext);