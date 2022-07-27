import React, {useContext, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import PlanerScreen from '../../../screens/Planner/PlannerScreen';
import {useTranslation} from 'react-i18next';

import {View} from 'react-native';

import routes from './../../routes';
import InventoryNavigator from './InventoryNavigator';
import colors from '../../../config/colors';
import SalesNavigator from './SalesNavigator';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Foundation';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpensesNavigator from './ExpensesNavigator';
import {StateContext} from '../../../global/context';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import {
  InventoryIcon,
  SalesIcon,
  ExpensesIcon,
  PlannerIcon,
} from '../../../components/Icons';

const Tab = createBottomTabNavigator();

const AppTabNavigator = ({navigation}) => {
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        headerTintColor: colors.white,

        headerStyle: {
          backgroundColor: colors.primary,
          borderBottomColor: colors.primary,
          elevation: 0,
        },
      }}>
      <Tab.Screen
        name={t(routes.salesNav)}
        component={SalesNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <SalesIcon color={color} size={size} />
          ),
          tabBarLabel: t('Sales'),
          headerTitle: t('Sales'),
        }}
      />
      <Tab.Screen
        name={t(routes.expensesNav)}
        component={ExpensesNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <ExpensesIcon color={color} size={size} />
          ),
          tabBarLabel: t('Expense'),
          headerTitle: t('Expense'),
        }}
      />

      <Tab.Screen
        name={t(routes.inventoryNav)}
        component={InventoryNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <InventoryIcon color={color} size={size} />
          ),
          tabBarLabel: t('Inventory'),
          headerTitle: t('Inventory'),
        }}
      />

      <Tab.Screen
        name={t(routes.plan)}
        component={PlanerScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <PlannerIcon color={color} size={size} />
          ),
          tabBarLabel: t('Plan'),
          headerTitle: t('Plan'),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabNavigator;
