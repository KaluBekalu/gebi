import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import colors from '../../config/colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import routes from '../../navigation/routes';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ItemDetails = ({route, navigation}) => {
  const {data} = route.params;

  return (
    <SafeAreaView style={[styles.container]}>
      {/* Header */}

      <View style={header.topBar}>
        <View style={{marginVertical: 0, marginHorizontal: 10}}>
          <View style={header.topBarContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(routes.inventory);
              }}
              style={{
                flex: 1.2,
                backgroundColor: colors.primary,
                marginRight: 20,
              }}>
              <Icon name="arrow-left" size={30} color={colors.white} />
            </TouchableOpacity>
            <Text style={{color: 'white', fontSize: 25, flex: 8}}>የዕቃ መረጃ</Text>
          </View>
        </View>
      </View>
      {/* End Header */}

      <ScrollView style={{flex: 1}}>
        <KeyboardAwareScrollView
          enableOnAndroid
          contentContainerStyle={[styles.keyboardAwareScrollContainer]}>
          <View
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 25,
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={{fontSize: 22, marginBottom: 5, color: colors.black}}>
                የእቃ ስም
              </Text>
              <Text
                style={{fontSize: 22, fontWeight: 'bold', color: colors.black}}>
                {data.item_name}
              </Text>
            </View>
            <View>
              <Image
                style={{width: 100, height: 100}}
                resizeMode="contain"
                source={require('../../assets/images/phone_image.jpg')}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: 22,
              marginTop: 25,
              fontWeight: 'bold',
              color: colors.black,
            }}>
            ዕቃ መረጃ
          </Text>
          <View style={styles.boardContainer}>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>የመሸጫ ዋጋ</Text>
              <Text style={styles.boardSubTitle}>
                {data.stock.unit_price} ብር
              </Text>
            </View>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>በእጅ ያለ</Text>
              <Text style={styles.boardSubTitle}>{data.stock.quantity}</Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 22,
              marginTop: 25,
              fontWeight: 'bold',
              color: colors.black,
            }}>
            የእቃ ታሪክ
          </Text>
          <View style={{marginVertical: 20}}>
            <View style={tableStyles.thead}>
              <Text style={tableStyles.theadFont}>ዋጋ</Text>
              <Text style={tableStyles.theadFont}>ብዛት</Text>
              <Text style={tableStyles.theadFont}>አቅራቢ</Text>
              <Text style={tableStyles.theadFont}>ቀን</Text>
            </View>
            {[1].map(e => {
              return (
                <View
                  key={e}
                  style={[
                    tableStyles.trow,
                    {backgroundColor: e % 2 != 0 ? 'transparent' : 'white'},
                  ]}>
                  <Text style={tableStyles.trowFont}>
                    {data.stock.unit_price} ብር
                  </Text>
                  <Text style={tableStyles.trowFont}>
                    {data.stock.quantity} pcs
                  </Text>
                  <Text style={tableStyles.trowFont}>
                    {data.stock.supplier_name}
                  </Text>
                  <Text style={tableStyles.trowFont}>{data.stock.date}</Text>
                  {/* <Text style={tableStyles.trowFont}>{data.stock.date}</Text> */}
                </View>
              );
            })}
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    marginHorizontal: 5,
  },
  keyboardAwareScrollContainer: {
    paddingVertical: 10,
    justifyContent: 'space-between',
    display: 'flex',
    flexGrow: 1,
    flex: 1,
  },
  boardContainer: {
    marginVertical: 15,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  boardCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardTopTitle: {fontSize: 18, color: colors.black, fontWeight: '800'},
  boardSubTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: colors.black,
  },
});

const tableStyles = StyleSheet.create({
  thead: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  theadFont: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  trow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  trowFont: {
    fontSize: 16,
    color: colors.black,
  },
  oddRow: {
    backgroundColor: 'transparent',
  },
  evenRow: {
    backgroundColor: 'white',
  },

  textStyle: {
    color: colors.black,
  },
});

const header = StyleSheet.create({
  topBar: {
    backgroundColor: colors.primary,
    borderBottomEndRadius: 30,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statContainer: {
    marginTop: 10,
  },

  // Typetwo
  boardContainer: {
    marginHorizontal: 5,
    marginVertical: 20,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  boardCol: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  buttonwithIcon: {
    backgroundColor: colors.lightBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    width: '25%',
    padding: 10,
    gap: 2,
  },
  boardTopTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.black,
  },
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
export default ItemDetails;