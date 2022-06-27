import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import routes from '../routes';
import {StateContext} from '../../global/context';
import PhoneInputScreen from '../../screens/AuthScreens/Registration/PhoneInputScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const {curlang, introDone} = useContext(StateContext);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={'#EEF1F2'} />

      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={routes.otp} component={PhoneInputScreen} />
      </Stack.Navigator>
    </>
  );
};
export default AuthNavigator;
