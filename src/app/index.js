import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import LoginPage from './login';
import Head from 'expo-router/head'
import SuperAdminPage from '../SuperAdmin/superAdmin'
// import DashboardPage from './dashboard';



export default function Page() {

  return (
    <>
    <Head>
        <title>DVIR</title>
        <meta name="description" content="Driver vehicle inspection report application" />
      </Head>
   <LoginPage />
  {/* <SuperAdminPage /> */}
   </>
  );
}


