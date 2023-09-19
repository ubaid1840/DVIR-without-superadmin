import { useLocalSearchParams, router } from "expo-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useState } from "react"



const superAdminDashboardPage = () => {
    const [email, setEmail] = useState(null)
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

    let i = 0;
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            console.log('user signed in')
            setEmail(user.auth.currentUser.email)
            // ...
        } else {
            // User is signed out
            // ...
            console.log('user signed out')
            router.replace('/')
        }
    });
    console.log(i)
    return (
        <>
            {email ? <SuperAdminPage /> : null}
        </>
    )
}

export default superAdminDashboardPage