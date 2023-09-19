// firestoreService.js

import { onSnapshot, collection, getFirestore, query, orderBy } from 'firebase/firestore';
import app from '../config/firebase';
import { useContext } from 'react';
import { InHouseWOContext } from '../store/context/InHouseWOContext';

const {state : inHouseWOState, setInHouseWO} = useContext(InHouseWOContext)

export const subscribeToCollectionInHouseWorkOrder = (collectionName, callback) => {


    const db = getFirestore(app)

    const q = query(collection(db, 'InHouseWorkOrders'), orderBy('TimeStamp', 'desc'))

    return onSnapshot(q, (snapshot) => {
        let temp = []
        snapshot.forEach((doc) => (temp.push(doc.data())));
        setInHouseWO(temp)
        callback(temp);
    });
};
