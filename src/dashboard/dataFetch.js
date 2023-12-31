import { useContext, useEffect } from "react"
import { DataContext } from "../store/context/DataContext"
import { collection, deleteDoc, doc, getDocs, getFirestore, or, orderBy, query, setDoc, where } from "firebase/firestore"
import app from "../config/firebase"
import DashboardPage from "./dashboard"
import { useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { DefectContext } from "../store/context/DefectContext"
import { AssetContext } from '../store/context/AssetContext'
import { AuthContext } from "../store/context/AuthContext"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { PeopleContext } from "../store/context/PeopleContext"
import { router } from "expo-router"
import { WOContext } from "../store/context/WOContext"
import { InHouseWOContext } from "../store/context/InHouseWOContext"


const DataFetchPage = (props) => {

    const { state: dataState, setData } = useContext(DataContext)
    const { state: defectState, setDefect } = useContext(DefectContext)
    const { state: assetState, setAssetData } = useContext(AssetContext)
    const [isLoading, setIsLoading] = useState(true)

    const { state: authState, setAuth } = useContext(AuthContext)
    const { state: peopleState, setPeopleData } = useContext(PeopleContext)
    const { state: woState, setWO } = useContext(WOContext)
    const { state: inHouseWOState, setInHouseWO } = useContext(InHouseWOContext)


    useEffect(() => {

        const fetchData = async () => {
            const db = getFirestore(app)
            const auth = getAuth(app)

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    if (user.emailVerified) {

                        await getDocs(collection(db, 'AllowedUsers'))
                            .then((snapshot) => {
                                let temp = []
                                snapshot.forEach((docs) => {
                                    temp.push(docs.data())
                                })
                                const loginUser = [...temp.filter((item) => item.Email === auth.currentUser.email)]
                                setAuth(loginUser[0].Number, loginUser[0].Name, loginUser[0].Designation, loginUser[0]['Employee Number'], loginUser[0].dp)
                                const data = [...temp]
                                const sortData = data.slice().sort((a, b) => b.TimeStamp - a.TimeStamp)
                                setPeopleData(sortData)
                            })
                    }
                    else {
                        router.replace('/')
                    }
                }
                else {
                    router.replace('/')
                }

            });


            try {

                const snapshot = await getDocs(query(collection(db, "Forms"), orderBy('TimeStamp', 'desc')))
                const list = []
                snapshot.forEach((docs) => {
                    list.push(docs.data())
                })

                if (list.length === 0) {
                    setData([])
                    // setIsLoading(false) // Data fetched, set loading to false
                } else {
                    setData(list)
                }

                const snapshotWO = await getDocs(collection(db, "WorkOrders"))
                const listWO = []
                snapshotWO.forEach((docs) => {
                    listWO.push(docs.data())
                })

                if (list.length === 0) {
                    setWO([])
                    // setIsLoading(false) // Data fetched, set loading to false
                } else {
                    setWO(listWO)
                }

                const assetSnapshot = await getDocs(collection(db, "Assets"))
                const assetList = []
                assetSnapshot.forEach((docs) => {
                    assetList.push(docs.data())
                })

                if (assetList.length === 0) {
                    setAssetData([])
                } else {
                    setAssetData(assetList)
                }

                const inHouseSnapshot = await getDocs(collection(db, "InHouseWorkOrders"))
                const inhouseList = []
                inHouseSnapshot.forEach((docs) => {
                    inhouseList.push(docs.data())
                })

                if (inhouseList.length === 0) {
                    setInHouseWO([])
                } else {
                    setInHouseWO(inhouseList)
                }

                const defectSnap = await getDocs(query(collection(db, 'Defects'), orderBy('dateCreated', 'desc')))
                const defectList = []
                defectSnap.forEach((docs) => {
                    defectList.push(docs.data())
                })

                if (defectList.length === 0) {
                    setDefect([])
                    setIsLoading(false)
                } else {
                    setDefect(defectList)
                    setIsLoading(false)
                }


            } catch (error) {
                console.error("Error fetching data: ", error)
                setIsLoading(false)
            }
        }

        if (isLoading) {
            fetchData()
        }

    }, [isLoading])



    return (
        <>
            {!isLoading
                ?

                <DashboardPage />
                // Show a loading indicator while data is being fetched
                :
                <View style={styles.activityIndicatorStyle}>
                    <ActivityIndicator color="#23d3d3" size="large" />
                </View>
            }
        </>
    )
}

export default DataFetchPage

const styles = StyleSheet.create({
    activityIndicatorStyle: {
        flex: 1,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        backgroundColor: '#FFFFFFDD',
    },
})

