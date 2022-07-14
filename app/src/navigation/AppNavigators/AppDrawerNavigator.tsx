import React, {useContext, useEffect, useState} from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsNavigator from './SettingsNavigator';
import colors from '../../config/colors';
import AppTabNavigator from '../AppNavigators/AppTabNavigator/AppTabNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import routes from '../routes';
import {useRoute} from '@react-navigation/native';
import {StateContext} from '../../global/context';
import {useTranslation} from 'react-i18next';

import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import CustomDrawer from './CustomDrawer';

import {useNavigation} from '@react-navigation/native';
const Drawer = createDrawerNavigator();

function AppDrawerNavigator() {
  const {t} = useTranslation();

  const {isReady} = useContext(StateContext);
  const {initializing} = useContext(StateContext);

  const navigation = useNavigation();
  const route = useRoute();

  if (!isReady || initializing) return null;

  return (
    <>
      <Drawer.Navigator
        drawerContent={props => (
          <CustomDrawer navigation={navigation} route={route} />
        )}
        screenOptions={({route}) => ({
          swipeEdgeWidth: 150,
          headerShown: true,
          headerTintColor: colors.white,
          headerTitle: getFocusedRouteNameFromRoute(route),
          headerStyle: {
            backgroundColor: colors.primary,
            borderBottomColor: colors.primary,
            elevation: 0,
          },
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
          },

          headerRightContainerStyle: {paddingRight: 20},
          headerRight: () => (
            <TouchableOpacity activeOpacity={0.5}>
              <Icon name="bell" color={colors.white} size={25} />
            </TouchableOpacity>
          ),
        })}>
        <Drawer.Screen name={routes.Gebi} component={AppTabNavigator} />
        <Drawer.Screen
          name={routes.settingsNav}
          options={{
            headerTitle: t('Settings'),
          }}
          component={SettingsNavigator}
        />
      </Drawer.Navigator>
    </>
  );
}

export default AppDrawerNavigator;
