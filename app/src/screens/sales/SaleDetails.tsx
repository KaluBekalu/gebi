import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useRef, useContext} from 'react';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import StatusBox from '../../components/misc/StatusBox';
import formatNumber from '../../utils/formatNumber';

import RNPrint from 'react-native-print';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

const receipt = require('./reciept');
import {useTranslation} from 'react-i18next';
import roundDecimal from '../../utils/roundDecimal';
import {StateContext} from '../../global/context';

const SaleDetails = ({route, navigation}) => {
  const {t} = useTranslation();
  const {data} = route.params;
  const {user} = useContext(StateContext);

  const [sum, setSum] = useState('');
  const [total, setTotal] = useState('');
  const [TOTVal, setTOTVal] = useState('');
  const [VATVal, setVATVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuvisible, setMenuvisible] = useState(false);

  const imageRef = useRef<any>(null);

  const calculate = () => {
    let sum: number = 0;
    let total: number = 0;
    Object.keys(data.items).map(i => {
      sum = sum + data.items[i].quantity * data.items[i].unitPrice;
    });

    if (data.vat && !data.tot) {
      total = sum * 0.15 + sum;
      setVATVal(formatNumber(sum * 0.15));
    }
    if (!data.vat && data.tot) {
      setTOTVal(formatNumber(sum * 0.02));
      total = sum * 0.02 + sum;
    }
    if (data.vat && data.tot) {
      setVATVal(formatNumber(sum * 0.15));
      total = sum * 0.15 + sum * 0.02 + sum;
      setVATVal(formatNumber(sum * 0.15));
      setTOTVal(formatNumber(sum * 0.02));
    }
    if (!data.vat && !data.tot) {
      total = sum;
    }

    setSum(formatNumber(sum));
    setTotal(formatNumber(total));
  };

  const capture = () => {
    imageRef.current!.capture().then(uri => {
      Share.open({url: uri});
    });
  };

  const rollBackSale = async () => {
    setLoading(true);
    let proceed = false;
    try {
      const items = data.items;
      for (var i in items) {
        await firestore()
          .collection('inventory')
          .doc(items[i].id)
          .get()
          .then(async res => {
            if (!res.data()) {
              setLoading(false);
              setError('Item does not exist in stock!');
              Alert.alert(`Item does not exist in stock!`, ``, [
                {
                  text: t('Cancel'),
                  onPress: () => {},
                  style: 'default',
                },
              ]);
              return;
            }
            proceed = true;
            await firestore()
              .collection('inventory')
              .doc(items[i].id)
              .update({
                currentCount:
                  parseFloat(res.data()!.currentCount) +
                  parseFloat(items[i].quantity),
              })
              .catch(err => {
                console.log(err);
              });
            setLoading(false);
          })
          .catch(err => console.log(err));
      }
      if (proceed) {
        firestore().collection('sales').doc(data.id).delete();
      }
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const titles = {
    paymentType: t('paymentType'),
    reciept: t('reciept'),
    Total: t('Total'),
    Vat: t('Vat'),
    Tax: t('Tax'),
    date: t('Date'),
    subtotal: t('subtotal'),
    Birr: t('Birr'),
    Quantity: t('Quantity'),
    Items_List: t('Items_List'),
    Sales_officer: t('Sales_officer'),
    Customer: t('Customer'),
    Invoice_Number: t('Invoice_Number '),
  };

  const print = async () => {
    const printData = {
      data: data,
      titles: titles,
      sum: sum,
      tax: parseFloat(sum) * 0.15,
      total: total,
    };

    await RNPrint.print({
      html: receipt(printData),
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      calculate();
    }
    return () => {
      mounted = false;
    };
  }, [data]);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {loading && (
        <StatusBox
          msg={t('Please_Wait...')}
          type="loading"
          overlay={true}
          onPress={() => {}}
        />
      )}
      <ScrollView style={{flex: 1}}>
        <View style={{backgroundColor: colors.white, width: '100%'}}>
          <TouchableOpacity
            style={{
              justifyContent: 'flex-end',
              marginLeft: 'auto',
            }}
            onPress={() => setMenuvisible(!menuvisible)}>
            <Icon
              name={!menuvisible ? 'sharealt' : 'close'}
              size={25}
              color={colors.primary}
              style={{margin: 5, marginLeft: 'auto'}}
            />
          </TouchableOpacity>
        </View>
        {menuvisible ? (
          <View
            style={{
              backgroundColor: 'white',
              elevation: 10,
              position: 'absolute',
              right: 30,
              zIndex: 10,
              top: 30,
              width: 100,
              justifyContent: 'space-around',
              paddingHorizontal: 10,
              height: 100,
              borderRadius: 5,
              borderTopRightRadius: 0,
              alignItems: 'flex-start',
              borderWidth: 0.6,
              borderColor: '#00000040',
            }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={() => print()}>
              <Icon name={'pdffile1'} size={30} color={colors.primary} />
              <Text style={{marginLeft: 5, fontSize: 15, color: colors.black}}>
                PDF
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={() => capture()}>
              <Icon name={'picture'} size={30} color={colors.primary} />
              <Text style={{marginLeft: 5, fontSize: 15, color: colors.black}}>
                Photo
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <ViewShot
          ref={imageRef}
          options={{format: 'jpg', quality: 0.9}}
          style={{
            backgroundColor: colors.white,
            paddingHorizontal: 10,
          }}>
          <ScrollView
            contentContainerStyle={{
              justifyContent: 'center',
            }}>
            <View style={styles.header}>
              <Text style={styles.pageTitle}>{t('Sales_Receipt')}</Text>
            </View>
            <View style={styles.topInfo}>
              <View style={styles.topInfoLeft}>
                <Text style={styles.textBold}>{data.date}</Text>
                <Text style={styles.textLight}>{t('Date')}</Text>
              </View>
              <View style={styles.topInfoRight}>
                <Text style={styles.textBold}>
                  {data.invoiceNumber.substring(0, 9)}
                  {'...'}
                </Text>
                <Text style={styles.textLight}>{t('Receipt_Number')}</Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 5,
                borderRadius: 5,
                backgroundColor: colors.white,
                marginHorizontal: 5,
                borderWidth: 0.4,
                borderColor: '#00000040',
                shadowColor: '#00000010',
                elevation: 10,
              }}>
              <Text style={styles.textBold}>
                {t('Customer')}
                {':'}
              </Text>
              <Text style={{fontSize: 15, color: colors.faded_dark}}>
                {data.customerName}
              </Text>
            </View>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 5,
                borderRadius: 5,
                backgroundColor: colors.white,
                marginHorizontal: 5,
                borderWidth: 0.4,
                borderColor: '#00000040',
                shadowColor: '#00000010',
                elevation: 10,
              }}>
              <Text style={styles.textBold}>
                {t('Sales_Officer')}
                {':'}
              </Text>
              <Text style={{fontSize: 15, color: colors.faded_dark}}>
                {data.createdBy}
              </Text>
            </View>
            <View style={styles.ListItemContainer}>
              <Text
                style={[
                  styles.textBold,
                  {marginVertical: 10, paddingHorizontal: 15},
                ]}>
                {t('Items_List')}
              </Text>

              <ScrollView
                style={{width: '100%'}}
                contentContainerStyle={{paddingHorizontal: 5}}>
                {Object.keys(data.items).map(i => {
                  return (
                    <View key={Math.random()} style={styles.ListItem}>
                      <View style={styles.LeftContainer}>
                        <View style={{marginLeft: 10}}>
                          <Text
                            style={{
                              color: colors.black,
                              fontSize: 15,
                              fontWeight: 'bold',
                            }}>
                            {data.items[i].itemName}
                          </Text>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.textBold}>
                              {
                                formatNumber(data.items[i].quantity).split(
                                  '.',
                                )[0]
                              }
                              <Text style={styles.textLight}>
                                {' '}
                                - {t('Amount')}
                              </Text>
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.RightContainer}>
                        <Text style={styles.textLight}>
                          <Text style={styles.textBold}>
                            {formatNumber(data.items[i].unitPrice)}
                            {t('Birr')}
                          </Text>
                          / {t('Single')}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryTop}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textLight}>{t('Sum')}</Text>
                  <Text
                    style={[
                      styles.textBold,
                      {textAlign: 'right', fontSize: 15},
                    ]}>
                    {sum} {t('Birr')}
                  </Text>
                </View>
                {data.vat ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textLight}>
                      {t('TAX')} (15% {t('VAT')})
                    </Text>
                    <Text
                      style={[
                        styles.textBold,
                        {textAlign: 'right', fontSize: 15},
                      ]}>
                      {VATVal} {t('Birr')}
                    </Text>
                  </View>
                ) : null}
                {data.tot ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Text style={styles.textLight}>
                      {t('TOT')} (0.02% {t('TOT')})
                    </Text>
                    <Text
                      style={[
                        styles.textBold,
                        {textAlign: 'right', fontSize: 15},
                      ]}>
                      {TOTVal} {t('Birr')}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.summaryBottom}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.textBold,
                      {fontSize: 15, fontWeight: '600'},
                    ]}>
                    {t('Total')}
                  </Text>
                  <Text
                    style={[
                      styles.textBold,
                      {
                        textAlign: 'right',
                        fontSize: 23,
                        textDecorationStyle: 'solid',
                        textDecorationLine: 'underline',
                      },
                    ]}>
                    {total} {t('Birr')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.paymentTypeContainer}>
              <View style={styles.paymentTop}>
                <Text
                  style={[
                    styles.textBold,
                    {marginBottom: 5, paddingHorizontal: 15},
                  ]}>
                  {t('Payment')}
                </Text>
                <Text
                  style={[
                    styles.textBold,
                    {
                      marginBottom: 5,
                      paddingHorizontal: 15,
                      color:
                        data.paymentMethod == 'Cash'
                          ? colors.green
                          : data.paymentMethod == 'Check'
                          ? colors.yellow
                          : colors.red,
                    },
                  ]}>
                  {t(data.paymentMethod)}
                </Text>
              </View>
            </View>
          </ScrollView>
        </ViewShot>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(t('Are_You_Sure?'), ``, [
              {
                text: t('Yes'),
                onPress: () => {
                  rollBackSale();
                },
                style: 'default',
              },
              {
                text: t('Cancel'),
                onPress: () => {},
                style: 'default',
              },
            ]);
          }}
          style={{
            backgroundColor: colors.red,
            height: 60,
            margin: 'auto',
            alignSelf: 'center',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            width: 'auto',
            alignItems: 'center',
            borderRadius: 5,
            flexDirection: 'row',
          }}>
          <Text
            style={[
              styles.textBold,
              {color: colors.white, textAlign: 'center'},
            ]}>
            {t('Roll_Back')}
          </Text>
          <Icon2 name="backup-restore" size={25} color={colors.white} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SaleDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 28,
    color: colors.black,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center',
    width: '100%',
  },
  topInfo: {
    borderBottomWidth: 1,
    marginTop: 10,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topInfoLeft: {
    padding: 0,
  },
  topInfoRight: {
    alignItems: 'flex-end',
  },
  textBold: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
    paddingHorizontal: 10,
  },
  textLight: {
    paddingHorizontal: 10,
    color: colors.faded_grey,
    fontWeight: '300',
    fontSize: 15,
  },

  textValue: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    paddingVertical: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  ListItemContainer: {
    justifyContent: 'center',
  },
  ListItem: {
    zIndex: 1,
    marginBottom: 5,
    elevation: 5,
    backgroundColor: colors.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'center',

    borderWidth: 0.4,
    borderColor: '#00000040',
  },
  LeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  summaryContainer: {
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 20,
    borderWidth: 0.4,
    borderColor: '#00000040',
    shadowColor: '#00000010',
    elevation: 10,
    paddingVertical: 10,
    backgroundColor: colors.white,
    marginHorizontal: 5,
  },
  summaryTop: {
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingTop: 15,
  },
  summaryBottom: {
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  paymentTypeContainer: {
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderWidth: 0.4,
    borderColor: '#00000040',
    shadowColor: '#00000010',
    elevation: 10,
    marginHorizontal: 5,
  },
  paymentTop: {
    justifyContent: 'space-between',
    padding: 8,
    flexDirection: 'row',
  },
});
