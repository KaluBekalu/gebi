import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import Loading from '../../components/lotties/Loading';
import StatusBox from '../../components/misc/StatusBox';

const SaleDetails = ({route, navigation}) => {
  const {data} = route.params;

  const [sum, setSum] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = () => {
    let sum: number = 0;
    let total: number = 0;
    Object.keys(data.items).map(i => {
      sum = sum + data.items[i].quantity * data.items[i].unitPrice;
    });
    total = sum * 0.15 + sum;
    setSum(sum);
    setTotal(total);
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
                  text: 'ተመለስ',
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
                'stock.quantity':
                  parseFloat(res.data()!.stock.quantity) +
                  parseFloat(items[i].quantity),
              })
              .catch(err => {
                console.log(err);
              });
            setLoading(false);
          });
      }
      proceed && firestore().collection('sales').doc(data.id).delete();
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
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
    <>
      {loading && (
        <StatusBox
          msg={'Please wait...'}
          type="loading"
          overlay={true}
          onPress={() => {}}
        />
      )}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: 'center',
        }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{width: 40}}
            onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={28} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>አዲስ የሽያጭ ደረሰኝ</Text>
        </View>
        <View style={styles.topInfo}>
          <View style={styles.topInfoLeft}>
            <Text style={styles.textLight}>ቀን</Text>
            <Text style={styles.textBold}>{data.date}</Text>
          </View>
          <View style={styles.topInfoRight}>
            <Text style={styles.textLight}>የደረሰኝ ቁጥር</Text>
            <Text style={styles.textBold}>23/20/014</Text>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.textBold}>ደንበኛ</Text>
          <Text style={styles.textValue}>{data.customerName}</Text>
        </View>
        <View style={styles.ListItemContainer}>
          <Text
            style={[
              styles.textBold,
              {marginVertical: 10, paddingHorizontal: 15},
            ]}>
            የእቃዎች ዝርዝር
          </Text>

          <ScrollView
            style={{maxHeight: 300, width: '100%'}}
            contentContainerStyle={{paddingHorizontal: 5}}>
            {Object.keys(data.items).map(i => {
              return (
                <View key={Math.random()} style={styles.ListItem}>
                  <View style={styles.LeftContainer}>
                    <View style={{marginLeft: 10}}>
                      <Text style={styles.textBold}>
                        {data.items[i].itemName}
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.textBold}>
                          {data.items[i].quantity}
                          <Text style={styles.textLight}> - ብዛት</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.RightContainer}>
                    <Text style={styles.textLight}>
                      <Text style={styles.textBold}>
                        {data.items[i].unitPrice}ብር
                      </Text>
                      /አንዱን
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
              <Text style={styles.textLight}>ድምር</Text>
              <Text
                style={[styles.textBold, {textAlign: 'right', fontSize: 20}]}>
                {sum} ብር
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={styles.textLight}>ታክስ (15% ቫት)</Text>
              <Text
                style={[styles.textBold, {textAlign: 'right', fontSize: 20}]}>
                {sum * 0.15} ብር
              </Text>
            </View>
          </View>
          <View style={styles.summaryBottom}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[styles.textBold, {fontSize: 20, fontWeight: '600'}]}>
                አጠቃላይ ድምር
              </Text>
              <Text
                style={[
                  styles.textBold,
                  {
                    textAlign: 'right',
                    fontSize: 25,
                    textDecorationStyle: 'solid',
                    textDecorationLine: 'underline',
                  },
                ]}>
                {total} ብር
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
              የክፍያ አይነት
            </Text>
            <Text
              style={[
                styles.textBold,
                {
                  marginBottom: 5,
                  paddingHorizontal: 15,
                  color: colors.yellow,
                },
              ]}>
              {data.paymentMethod}
            </Text>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(`እርግጠኛ ነዎት?`, ``, [
                {
                  text: 'አዎ',
                  onPress: () => {
                    rollBackSale();
                  },
                  style: 'default',
                },
                {
                  text: 'ተመለስ',
                  onPress: () => {},
                  style: 'default',
                },
              ]);
            }}
            style={{
              backgroundColor: colors.red,
              height: 60,
              marginBottom: 40,
              paddingHorizontal: 20,
              justifyContent: 'space-between',
              width: 'auto',
              alignItems: 'center',
              borderRadius: 30,
              flexDirection: 'row',
            }}>
            <Text
              style={[
                styles.textBold,
                {color: colors.white, textAlign: 'center'},
              ]}>
              ተመላሽ አድርግ
            </Text>
            <Image
              resizeMethod="auto"
              source={require('../../assets/icons/arrow-right.png')}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default SaleDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 25,
    color: colors.black,
    fontWeight: 'bold',
    marginLeft: 10,
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
    fontSize: 20,
    paddingHorizontal: 10,
  },
  textLight: {
    paddingHorizontal: 10,
    color: colors.faded_grey,
    fontWeight: '300',
    fontSize: 18,
  },

  textValue: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 20,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    paddingVertical: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
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
    borderRadius: 10,
    alignSelf: 'center',
  },
  LeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  RightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 'auto',
  },
  summaryContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 20,
    elevation: 1,
    paddingVertical: 10,
    backgroundColor: colors.white,
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
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  paymentTop: {
    justifyContent: 'space-between',
    padding: 8,
    flexDirection: 'row',
  },
});