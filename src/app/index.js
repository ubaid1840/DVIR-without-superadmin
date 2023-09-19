import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import LoginPage from './login';
import Head from 'expo-router/head'
import DataContextProvider from '../store/context/DataContext'
import CheckLoginPage from '../dashboard/checkLogin';
// import DashboardPage from './dashboard';




export default function Page() {


  return (
    <>
        <CheckLoginPage />
      {/* <SuperAdminPage /> */}
    </>
  );



}


