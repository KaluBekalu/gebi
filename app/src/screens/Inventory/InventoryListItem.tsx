import {View, StyleSheet, Text, Image} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import {useTranslation} from 'react-i18next';
import formatNumber from '../../utils/formatNumber';

const ListItem = ({title, unitPrice, quantity, picture}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.listItem}>
      <View style={styles.listLeft}>
        <View style={styles.thumbnail}>
          <Image
            style={{width: 50, height: 50, borderRadius: 10}}
            source={
              picture
                ? {uri: picture}
                : require('../../assets/images/no_image.jpg')
            }
          />
        </View>
        <View style={{marginLeft: 10}}>
          <View style={styles.listTitleContainer}>
            <Text style={styles.listTextbold}>{title}</Text>
          </View>
          <View style={styles.listdescription}>
            <Text style={[styles.listTextbold]}>
              {formatNumber(unitPrice)} {t('Birr')}
            </Text>
            <Text style={[styles.listTextLight, {marginBottom: 2}]}>
              /{t('Single')}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.listRight}>
        <View style={styles.listPriceContainer}>
          <Text style={[styles.listTextbold, {color: colors.black}]}>
            {formatNumber(quantity).split('.')[0]}
          </Text>
        </View>
        <View>
          <Text style={[styles.listTextLight, {textAlign: 'right'}]}>
            {t('In_Stock')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // List Item
  listItem: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 60,
    borderRadius: 10,
    margin: 5,
  },
  listItemDesc: {
    marginLeft: 5,
  },
  listTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  thumbnail: {},
  listLeft: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRight: {
    justifyContent: 'flex-end',
  },
  listdescription: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  listPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  listTextbold: {
    fontWeight: '600',
    fontSize: 15,
    color: colors.black,
    marginRight: 5,
    // marginLeft: 5,
  },
  listTextLight: {
    fontWeight: '300',
    color: colors.grey,
    marginRight: 5,
  },
});

export default ListItem;
