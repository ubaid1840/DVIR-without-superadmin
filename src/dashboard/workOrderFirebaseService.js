// firestoreService.js

import { onSnapshot, collection, getFirestore, query, orderBy } from 'firebase/firestore';
import app from '../config/firebase';


export const subscribeToCollectionWorkOrder = (collectionName, callback) => {
    const db = getFirestore(app)

    const q = query(collection(db, 'WorkOrders'), orderBy('TimeStamp', 'desc'))

    return onSnapshot(q, (snapshot) => {
        let temp = []
        snapshot.forEach((doc) => (temp.push(doc.data())));
        callback(temp);
    });
};
