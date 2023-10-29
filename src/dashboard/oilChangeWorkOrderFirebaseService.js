// firestoreService.js

import { onSnapshot, collection, getFirestore, query, orderBy } from 'firebase/firestore';
import app from '../config/firebase';
import { useContext } from 'react';
import { InHouseWOContext } from '../store/context/InHouseWOContext';
import { OilChangeWOContext } from '../store/context/OilChangeWOContext';

const {state : inHouseWOState, setInHouseWO} = useContext(InHouseWOContext)
const {state : oilChangeWOState, setOilChangeWO} = useContext(OilChangeWOContext)

export const subscribeToCollectionOilChangeWorkOrder = (collectionName, callback) => {


    const db = getFirestore(app)

    const q = query(collection(db, 'OilChangeWorkOrders'), orderBy('TimeStamp', 'desc'))

    return onSnapshot(q, (snapshot) => {
        let temp = []
        snapshot.forEach((doc) => (temp.push(doc.data())));
        setOilChangeWO(temp)
        callback(temp);
    });
};
