import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useContext, useEffect } from "react"
import app from "../config/firebase";
import { Link, router } from 'expo-router';
import { AuthContext } from "../store/context/AuthContext";


const CheckLoginPage = () => {

    const db = getFirestore(app)
    const auth = getAuth(app)


    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {

            if (user) {
                router.replace('/dashboardLogin')
            }
            else {
                router.replace('/login')

            }
        });
    }, [])
}

export default CheckLoginPage