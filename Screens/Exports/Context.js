import React,{useEffect , createContext} from 'react'
export const RandomContext = createContext()
export const UserContext = createContext()

export const RandomProvider = RandomContext.Provider
export const RandomConsumer = RandomContext.Consumer
export const UserProvider = UserContext.Provider
export const UserConsumer = UserContext.Consumer



export const authContext = createContext({
  authenticated: false,
  setAuthenticated: (auth) => {}
});

