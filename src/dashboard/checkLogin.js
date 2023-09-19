import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useContext, useEffect } from "react"
import app from "../config/firebase";
import { Link, router } from 'expo-router';
import { AuthContext } from "../store/context/AuthContext";


const CheckLoginPage = () => {

    const db = getFirestore(app)
    const auth = getAuth(app)
    const {state : authState, setAuth} = useContext(AuthContext)


    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await getDocs(query(collection(db, "AllowedUsers"), where('Email', '==', auth.currentUser.email)))
                    .then((snapshot) => {
                        console.log(snapshot)
                        snapshot.forEach((doc) => {
                            setAuth(doc.data().Number, doc.data().Name, doc.data().Designation, doc.data()['Employee Number'], doc.data().dp)
                            router.replace('/dashboardLogin')
                        })
                    })
            }
            else {
                router.replace('/login')
            }
        });
    }, [])
}

export default CheckLoginPage