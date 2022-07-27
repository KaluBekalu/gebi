import React, {useContext, useEffect} from 'react';
import {StatusBar, View} from 'react-native';

import {StateContext} from '../global/context';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AppDrawerNavigator from './AppNavigators/AppDrawerNavigator';
import AuthNavigator from './AuthNavigators/AuthNavigator';

import Loading from '../components/lotties/Loading';
import colors from '../config/colors';
import firestore from '@react-native-firebase/firestore';
import NewUserNavigator from './NewUserNavigator/NewUserNavigator';
import LottieView from 'lottie-react-native';
import routes from './routes';

const Stack = createStackNavigator();

const EntryApp = ({navigation}) => {
  const {user, userInfo, initializing} = useContext(StateContext);

  useEffect(() => {
    if (!user && !initializing) {
      navigation.replace(routes.authNavigator, {
        screen: routes.otp,
      });
    }
  }, [user]);

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          zIndex: 12,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LottieView
          style={{
            height: 100,
          }}
          source={require('../assets/loading.json')}
          speed={1.3}
          autoPlay
          loop={true}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Stack.Navigator
        initialRouteName={
          !user || userInfo.length == 0
            ? routes.authNavigator
            : routes.mainNavigator
        }
        screenOptions={{headerShown: false}}>
        <Stack.Screen name={routes.authNavigator} component={AuthNavigator} />
        <Stack.Screen
          name={routes.mainNavigator}
          component={AppDrawerNavigator}
        />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
};;

export default EntryApp;

//
//
//
//
//                                                       README
// Main Router is the main entry Navigation container where Auth is checked and from there navigators re rendered accordingly
// AppDrawerNavigator is a DRAWER Navigator, it nest both AppNavigator (TabNavigator) and Intro Navigator (Stack Navigator)
//
//                                                       Navigation Map
//
//                                                      Main Router
//                                                           |
//              AuthNavigator--------------------------------|------------- AppDrawerNavigtor
//        -----------|-------------                                                 |
//       |           |            |                                                 |
//  Register      Login   IntroNavigator(Stack)                                     |
//                                                       AppTabNavigator(Tab)  -----|---- OtherScreens...(settings...)
//                                                                  |
//                                                      Sales Screen|
//                                                  Inventory Screen|
//                                                   Expenses Screen|
//                                                   Planning Screen|
//
// =*= We can only nest TabNavigator in DrawerNavigator, but not vise versa. :(
