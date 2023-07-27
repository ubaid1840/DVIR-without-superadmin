import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './src/pages/Login';
import SignupPage from './src/pages/Signup';
import ForgetPasswordPage from './src/pages/ForgetPassword';
import DashboardPage from './src/pages/Dashboard';
import AssetsPage from './src/pages/Assets';
import CreateNewAssetPage from './src/pages/CreateNewAsset';

const App = () => {

  const AppStack = createNativeStackNavigator();

  const AssetStack = createNativeStackNavigator ();



  return (
    <NavigationContainer >
      <AppStack.Navigator initialRouteName='Dashboard' options={{}}>
        <AppStack.Screen name='Login' component={LoginPage} options={{ headerShown: false }}></AppStack.Screen>
        <AppStack.Screen name='Signup' component={SignupPage} options={{ headerShown: false }}></AppStack.Screen>
        <AppStack.Screen name='ForgetPassword' component={ForgetPasswordPage} options={{ headerShown: false }}></AppStack.Screen>
        <AppStack.Screen name='Dashboard' component={DashboardPage} options={{ headerShown: false }}></AppStack.Screen>
        <AppStack.Screen name='CreateNewAsset' component={CreateNewAssetPage} options={{ headerShown: false }}></AppStack.Screen>
         </AppStack.Navigator>

     
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
});

export default App;
