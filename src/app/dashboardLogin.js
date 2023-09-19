import { useLocalSearchParams, router } from "expo-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import DashboardPage from "../dashboard/dashboard"
import { collection, getDocs, getFirestore } from "firebase/firestore"
import app from "../config/firebase"
import { useContext } from "react"
import { DataContext } from "../store/context/DataContext"
import DataFetchPage from "../dashboard/dataFetch"
import { AuthContext } from "../store/context/AuthContext"



const DashboardLoginPage = () => {

    return (
        <>
            <DataFetchPage
            />

        </>
    )
}

export default DashboardLoginPage