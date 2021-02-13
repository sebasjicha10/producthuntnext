import React, {useState, useEffect} from 'react'
import firebase from "../firebase"


const  useAuthentication = () => {
    const [userAuthenticated, setUserAuthenticated] = useState(null)

    useEffect(() => {

        const unsubscribe = firebase.auth.onAuthStateChanged(user => {
            if(user) {
                setUserAuthenticated(user)
            } else {
                setUserAuthenticated(null)
            }
        })
        return () => unsubscribe()
    }, [])

    return userAuthenticated
}

export default useAuthentication