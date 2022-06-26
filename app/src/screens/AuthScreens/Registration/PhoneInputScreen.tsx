import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, Image} from 'react-native';
import {Text} from '@rneui/themed';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';
import colors from '../../../config/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '../../../components/misc/Button';
import Loading from '../../../components/lotties/Loading';
import {TouchableOpacity} from 'react-native-gesture-handler';

const PhoneInputScreen = ({navigation}) => {
  const [phoneNumber, setphoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Section
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(n) {
    try {
      if (n.length > 9 || n.length < 9 || !n.startsWith('9')) {
        setError('Invalid phone number');
        return;
      }
      setLoading(true);
      console.log(n);
      const confirmation = await auth().signInWithPhoneNumber('+251' + n);
      setConfirm(confirmation);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const confirmCode = async () => {
    setLoading(true);
    try {
      await confirm?.confirm(code);
      setLoading(false);
    } catch (error) {
      console.log('Invalid code.');
      setLoading(false);
    }
  };

  const checkPhone = (val: String) => {};
  // END OTP Section

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(colors.light);
  }, []);

  let dimensions = Dimensions.get('window');

  return (
    <SafeAreaView style={[styles.container]}>
      {loading ? (
        <Loading size={100}/>
      ) : (
        <KeyboardAwareScrollView
          enableOnAndroid
          contentContainerStyle={{
            paddingVertical: 10,
            justifyContent: 'space-evenly',
            display: 'flex',
            flexGrow: 1,
          }}>
          {!confirm ? (
            <>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: dimensions.height * 0.2,
                }}>
                <Text h3 style={{marginBottom: 40, color: colors.primary}}>
                  ለመጀመር ይመዝገቡ
                </Text>
              </View>
              <View style={{marginBottom: dimensions.height * 0.1}}>
                <Text
                  style={{fontSize: 25, marginBottom: 5, fontWeight: 'bold'}}>
                  የስልክዎን ቁጥር ያስገቡ
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 10,
                    borderWidth: 1,
                    padding: 0,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../../assets/ethiopianflag.png')}
                    style={{
                      width: 50,
                      height: 50,
                      marginHorizontal: 10,
                      borderRadius: 50,
                    }}
                  />
                  <Text
                    style={{fontSize: 28, marginLeft: 5, fontWeight: 'bold'}}>
                    +251
                  </Text>
                  <TextInput
                    style={[styles.phoneInput, {flexGrow: 1, marginRight: 0}]}
                    onChangeText={val => {
                      setError('');
                      setphoneNumber(val);
                    }}
                    value={phoneNumber}
                    placeholder="ስልክ ቁጥር ያስግቡ"
                    keyboardType="numeric"
                    placeholderTextColor={colors.faded_grey}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'red',
                    marginVertical: 15,
                    paddingHorizontal: 10,
                  }}>
                  {error}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => signInWithPhoneNumber(phoneNumber)}
                  activeOpacity={0.7}
                  style={{
                    width: '100%',
                    height: 70,
                    justifyContent: 'center',
                    borderRadius: 30,
                    backgroundColor: colors.primary,
                    paddingHorizontal: 30,
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 25,
                        color: colors.white,
                      }}>
                      ቀጥል
                    </Text>
                    <Icon name={'arrow-right'} color={'white'} size={35} />
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={{flex: 0.6, justifyContent: 'center'}}>
              <View
                style={{
                  marginHorizontal: 'auto',
                  width: '100%',
                  marginBottom: 50,
                  maxHeight: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}>
                <Image
                  style={{resizeMode: 'center'}}
                  source={require('../../../assets/logo-blue.png')}
                />
              </View>
              <Text
                style={{fontSize: 16, marginBottom: 10, fontWeight: 'bold'}}>
                {phoneNumber ? (
                  <Text
                    style={{
                      fontSize: 20,
                      width: '100%',
                      textAlign: 'center',
                    }}>
                    {' '}
                    ወደ{' '}
                    <Text
                      style={{
                        color: colors.primary,
                        fontStyle: 'italic',
                        fontWeight: '600',
                      }}>
                      {phoneNumber}
                      {'  '}
                    </Text>
                    የተላከውን ኮድ ያስገቡ
                  </Text>
                ) : (
                  ''
                )}
              </Text>
              <View
                style={{
                  // flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TextInput
                  style={styles.confirmInput}
                  onChangeText={(code: any) => setCode(code)}
                  value={code}
                  placeholder={'ምሳሌ፡ 123456'}
                  placeholderTextColor={colors.faded_grey}
                  keyboardType="numeric"
                />
              </View>
              <View
                style={{
                  flex: 0.2,
                  marginTop: 20,
                  justifyContent: 'space-around',
                }}>
                {/* <Button
                  btnStyle={'outlined'}
                  title={'ድጋሜ ኮድ ላክ'}
                  onPress={() => {}}
                /> */}
                <Button
                  btnStyle={'normal'}
                  title={'አረጋግጥ'}
                  // onPress={() => navigation.navigate('UserInfoInput')}
                  onPress={() => confirmCode()}
                />
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    flex: 1,
    display: 'flex',
    marginHorizontal: 15,
    justifyContent: 'center',
    // alignItems: 'center'
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
  },
  buttonStyle: {
    backgroundColor: 'green',
    borderColor: 'transparent',
    borderRadius: 25,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingRight: 15,
  },
  buttonGrayStyle: {
    borderColor: 'transparent',
    borderRadius: 25,
    paddingVertical: 10,
    justifyContent: 'space-between',
    paddingRight: 15,
    flexGrow: 1,
  },
  buttonTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  confirmInput: {
    color: colors.black,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    marginBottom: 20,
    flexGrow: 1,
  },
  phoneInput: {
    height: 60,
    margin: 12,

    color: colors.black,
    padding: 5,
    fontSize: 28,
  },
});

export default PhoneInputScreen;
PhoneInputScreen.routeName = 'RegisterPhone';