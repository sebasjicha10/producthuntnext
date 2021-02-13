import app from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"
import firebaseConfing from "./config"


class Firebase {
    constructor() {
        if(!app.apps.length) {
            app.initializeApp(firebaseConfing)
        }
        this.auth = app.auth()
        this.db = app.firestore()
        this.storage = app.storage()
    }

    // Register user
    async register(name, email, password) {
        const newUser = await this.auth.createUserWithEmailAndPassword(email, password)

        return await newUser.user.updateProfile({
            displayName: name
        })
    }

    // Log in user
    async login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    // Log out user 
    async logOut() {
        await this.auth.signOut()
    }
}

const firebase = new Firebase()
export default firebase