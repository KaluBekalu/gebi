import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import {Text} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useTranslation} from 'react-i18next';

import LottieView from 'lottie-react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/AntDesign';

import {StateContext} from '../../global/context';
import colors from '../../config/colors';
import ImageSelector from '../../components/ImageSelector/ImageSelector';

const AddNew = ({addNewModalVisible, setAddNewModalVisible}) => {
  const {t} = useTranslation();
  const {user} = useContext(StateContext);

  const [unit, setUnit] = useState('');
  const [photo, setPhoto] = useState('');
  const [itemId, setItemId]: Array<any> = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setAmount] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [writtingData, setWrittingData] = useState(false);
  const [errorMessage, setErrorNessage] = useState('');
  const [failedAnimation, setFailedAnimation] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [allItems, setAllItems]: Array<any> = useState([]);
  const [searchResult, setSearchResult]: Array<any> = useState([]);
  const [searchResultVisible, setSearchResultVisible] = useState(false);

  const quantifiers = ['ፍሬ', 'ኪሎ', 'ሊትር'];
  const [categories, setCategories]: Array<any> = useState([]);

  const searchItem = key => {
    if (!key) setSearchResult([]);
    if (key) {
      setSearchResult(
        allItems.filter(i => {
          return i.doc.item_name.toLowerCase().includes(key.toLowerCase());
        }),
      );
    }
  };

  const getItems = () => {
    firestore()
      .collection('inventory')
      .where('owner', '==', user.uid)
      .onSnapshot(qsn => {
        let result: Array<any> = [];
        if (qsn) {
          qsn.forEach(sn => {
            result.push({
              id: sn.id,
              doc: sn.data(),
            });
          });

          setAllItems(result);
        }
      });
  };

  const getCategories = () => {
    firestore()
      .collection('categories')
      .where('owner', '==', user.uid)
      .onSnapshot(qsn => {
        let result: Array<any> = [];
        if (qsn) {
          qsn.forEach(sn => {
            result.push(
              sn.data().name.substring(0, 1).toUpperCase() +
                sn.data().name.substring(1),
            );
          });
          setCategories(result);
        }
      });
  };

  const checkEmpty = () => {
    if (!supplierName) return true;
    if (!itemName) return true;
    if (!quantity) return true;
    if (!unit) return true;
    if (!photo) return true;
    if (!unitPrice) return true;
    return false;
  };

  const raiseError = msg => {
    setErrorNessage(msg);
    setFailedAnimation(true);
  };

  const addNewInventory = async () => {
    if (checkEmpty()) return raiseError('Empty_Empty_Fields_Are_Not_Allowed');
    setWrittingData(true);
    try {
      const reference = storage().ref(`image_${Date.now()}`);
      const pathToFile = photo;
      const task = reference.putFile(pathToFile);

      task.on('state_changed', taskSnapshot => {});

      task
        .then(async res => {
          const fileUrl = await reference.getDownloadURL();
          if (searchResult.length) {
            setWrittingData(false);
            raiseError('Item_Duplicate');

            return;
          }
          if (itemId) {
            await firestore()
              .collection('inventory')
              .doc(itemId)
              .update({
                unit_price: unitPrice,
                currentCount: firestore.FieldValue.increment(
                  parseFloat(quantity),
                ),
              })
              .then(res => {
                firestore().collection('stock').add({
                  item_id: itemId,
                  supplier_name: supplierName,
                  initialCount: quantity,
                  unit_price: unitPrice,
                  unit: unit,
                  owner: user.uid,
                  date: new Date().toLocaleDateString(),
                });
              });

            setWrittingData(false);
            setSuccessAnimation(true);
            setTimeout(() => {
              setSuccessAnimation(false);
              setAddNewModalVisible(false);
            }, 500);
            setTimeout(() => {
              setAddNewModalVisible(false);
            }, 600);
          } else {
            await firestore()
              .collection('inventory')
              .add({
                owner: user.uid,
                item_name: itemName,
                unit_price: unitPrice,
                currentCount: quantity,
                picture: fileUrl,
                category: itemCategory.toLowerCase(),
              })
              .then(res => {
                const item_id = res['_documentPath']['_parts'][1];
                firestore().collection('stock').add({
                  item_id: item_id,
                  supplier_name: supplierName,
                  initialCount: quantity,
                  unit_price: unitPrice,
                  unit: unit,
                  owner: user.uid,
                  date: new Date().toLocaleDateString(),
                });
              });

            setWrittingData(false);
            setSuccessAnimation(true);
            setTimeout(() => {
              setSuccessAnimation(false);
              setAddNewModalVisible(false);
            }, 500);
            setTimeout(() => {
              setAddNewModalVisible(false);
            }, 600);
          }
        })
        .catch(err => console.log(err));
    } catch (error) {
      setWrittingData(false);
      raiseError(`Something went wrong.\nTry again.`);
      console.log(error);
    }
  };

  useEffect(() => {
    getItems();
    getCategories();
  }, []);

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={addNewModalVisible}
        onRequestClose={() => {}}>
        {writtingData ? (
          <View
            style={{
              position: 'absolute',
              zIndex: 12,
              flex: 1,
              width: '100%',
              height: '100%',
              backgroundColor: '#00000090',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 100,
                borderRadius: 20,
                aspectRatio: 1,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LottieView
                style={{
                  height: 80,
                  backgroundColor: '#fff',
                }}
                source={require('../../assets/loading.json')}
                speed={1.3}
                autoPlay
                loop={true}
              />
            </View>
          </View>
        ) : successAnimation ? (
          <View
            style={{
              position: 'absolute',
              zIndex: 12,
              flex: 1,
              width: '100%',
              height: '100%',
              backgroundColor: '#00000090',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 100,
                borderRadius: 20,
                aspectRatio: 1,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LottieView
                style={{
                  height: 80,
                  backgroundColor: '#fff',
                }}
                source={require('../../assets/success.json')}
                speed={1.3}
                autoPlay
                loop={false}
              />
            </View>
          </View>
        ) : failedAnimation ? (
          <Pressable
            onPress={() => {
              setFailedAnimation(false);
              setWrittingData(false);
              setSuccessAnimation(false);
            }}
            style={{
              position: 'absolute',
              zIndex: 12,
              flex: 1,
              width: '100%',
              height: '100%',
              backgroundColor: '#00000099',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 200,
                borderRadius: 20,
                aspectRatio: 1,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LottieView
                style={{
                  height: 80,
                  backgroundColor: '#fff',
                }}
                source={require('../../assets/failed.json')}
                speed={1.3}
                autoPlay
                loop={true}
              />
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                {t(errorMessage)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setFailedAnimation(false);
                  setWrittingData(false);
                  setSuccessAnimation(false);
                }}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 30,
                  paddingVertical: 5,
                  marginTop: 20,
                  borderRadius: 10,
                }}>
                <Icon name="back" color={colors.white} size={20} />
              </TouchableOpacity>
            </View>
          </Pressable>
        ) : null}
        <View
          style={{
            padding: 10,
            flex: 1,
            backgroundColor: '#00000095',
          }}>
          <ScrollView>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                marginBottom: 20,
                borderRadius: 20,
                padding: 20,
              }}>
              <TouchableOpacity onPress={() => setAddNewModalVisible(false)}>
                <Icon
                  name="close"
                  size={25}
                  color={colors.black}
                  style={{alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 30,
                  color: colors.primary,
                  textAlign: 'center',
                  marginVertical: 5,
                }}>
                {t('Add_New_Item')}
              </Text>

              <ImageSelector photo={photo} setPhoto={setPhoto} />

              <Text
                style={{
                  color: colors.black,
                  fontSize: 20,
                  marginBottom: 5,
                }}>
                {t('Supplier_Name')}
              </Text>
              <TextInput
                style={[styles.Input]}
                onChangeText={val => {
                  setSupplierName(val);
                }}
                onFocus={() => setSearchResultVisible(false)}
                value={supplierName}
                keyboardType="default"
                placeholderTextColor={colors.faded_grey}
              />

              <View>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 20,
                    marginBottom: 5,
                  }}>
                  {t('Item_Name')}
                </Text>
                <TextInput
                  style={[styles.Input]}
                  onChangeText={val => {
                    setItemName(val);
                    searchItem(val);
                    setSearchResultVisible(true);
                  }}
                  onFocus={() => setSearchResultVisible(true)}
                  value={itemName}
                  keyboardType="default"
                  placeholderTextColor={colors.faded_grey}
                />
                {searchResult.length && searchResultVisible ? (
                  <View
                    style={{
                      zIndex: 10,
                    }}>
                    <View
                      style={{
                        backgroundColor: colors.white,
                        position: 'absolute',
                        top: -30,
                        width: '100%',
                        elevation: 10,
                        padding: 10,
                        marginTop: 10,
                      }}>
                      {searchResult.map(i => (
                        <TouchableOpacity
                          key={i.id}
                          onPress={() => {
                            setItemName(i.doc.item_name);
                            setItemId(i.id);
                            setSearchResultVisible(false);
                          }}>
                          <Text
                            style={{
                              color: colors.black,
                              fontSize: 22,
                              marginVertical: 5,
                              borderBottomWidth: 0.4,
                              borderColor: '#00000040',
                            }}>
                            {i.doc.item_name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 5,
                  }}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 20,
                      marginBottom: 5,
                    }}>
                    {t('Amount')}
                  </Text>
                  <TextInput
                    style={[styles.Input]}
                    onChangeText={val => {
                      setAmount(val.replace(/[^0-9\.?]/g, ''));
                    }}
                    onFocus={() => setSearchResultVisible(false)}
                    value={quantity}
                    keyboardType="numeric"
                    placeholderTextColor={colors.faded_grey}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 5,
                  }}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 20,
                      marginBottom: 5,
                    }}>
                    {t('Unit_Price')} {`(${t('Birr')})`}
                  </Text>
                  <TextInput
                    style={[styles.Input]}
                    onChangeText={val => {
                      setUnitPrice(val.replace(/[^0-9\.?]/g, ''));
                    }}
                    onFocus={() => setSearchResultVisible(false)}
                    value={unitPrice}
                    keyboardType="numeric"
                    placeholderTextColor={colors.faded_grey}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 5,
                }}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 20,
                    marginBottom: 5,
                  }}>
                  {t('Category')}
                </Text>
                <SelectDropdown
                  data={categories}
                  defaultButtonText={t('Category')}
                  renderDropdownIcon={() => (
                    <View>
                      <Icon name="caretdown" size={20} color={colors.black} />
                    </View>
                  )}
                  onFocus={() => setSearchResultVisible(false)}
                  buttonStyle={styles.dropDown}
                  onSelect={selectedItem => {
                    setItemCategory(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 20,
                    marginBottom: 5,
                  }}>
                  {t('Unit')}
                </Text>
                <SelectDropdown
                  data={quantifiers}
                  defaultButtonText={t('Unit')}
                  renderDropdownIcon={() => (
                    <View>
                      <Icon name="caretdown" size={20} color={colors.black} />
                    </View>
                  )}
                  buttonStyle={styles.dropDown}
                  onSelect={selectedItem => {
                    setUnit(selectedItem);
                  }}
                  onFocus={() => setSearchResultVisible(false)}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={addNewInventory}
                style={{
                  width: '100%',
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  backgroundColor: colors.primary,
                }}>
                <Text style={{color: colors.white, fontSize: 25}}>
                  {t('Add')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
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
    alignItems: 'center',
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
  Input: {
    color: colors.black,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    marginBottom: 20,
  },
  dropDown: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  boardTopTitle: {fontSize: 22, fontWeight: '900'},
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});

export default AddNew;
