import { createContext, useState } from "react";


export const CounterContext= createContext()

export function CounterContextProvider({children}){

const [counter, setcounter] = useState(0)
const [user, setuser] = useState('ahmed')



    return< CounterContext.Provider value={{counter , setcounter , user , setuser}}>
{children}
    </CounterContext.Provider>
}