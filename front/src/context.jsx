'use client';
import { createContext, useContext, useState } from 'react';
const collectiocontext=createContext()
    export function CollectionProvider({children}){
        const [coll,setcoll]=useState(null)
        console.log(coll)
        return(
        <collectiocontext.Provider value={{ coll, setcoll }}>
            {children}
        </collectiocontext.Provider>
        )
    }
export const usecollection=()=>useContext(collectiocontext)