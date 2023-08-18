import { useLocalSearchParams, router } from "expo-router"
import SuperAdminPage from "../SuperAdmin/superAdmin"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import DashboardPage from "../dashboard/dashboard"
import { collection, getDocs, getFirestore } from "firebase/firestore"
import app from "../config/firebase"



const DashboardLoginPage = () => {

    const db = getFirestore(app)
    const auth = getAuth();

    const [email, setEmail] = useState(null)
    const [des, setDes] = useState(null)
    const params = useLocalSearchParams()
    // console.log(getAuth().currentUser.email)
    // if(params.id == 'superAdminLogin')
    // return (
    //     <SuperAdminPage />
    // )
    // else
    // {
    //     window.location.href = '/'
    // }

    const fetchData = async () => {
        await getDocs(collection(db, "AllowedUsers"))
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if(doc.data().Email == auth.currentUser.email)
                    setDes(doc.data().Designation)
                })
            })
    }

    useEffect(() => {
        fetchData()
    })

    let i = 0;
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            // console.log('user signed in')
            setEmail(user.auth.currentUser.email)
            // ...
        } else {
            // User is signed out
            // ...
            console.log('user signed out')
            router.replace('/')
        }
    });
    // console.log(i)
    return (
        <>
            {
                des == null
                    ? null
                    : email != null
                        ? <DashboardPage 
                        role = {des}/>
                        : null}
        </>
    )
}

export default DashboardLoginPage