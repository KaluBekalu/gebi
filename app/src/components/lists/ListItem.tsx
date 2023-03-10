import {View, StyleSheet, Text} from 'react-native';
import React from 'react';
import colors from '../../config/colors';

const ListItem = ({title, weight, invNumber, location, price, date}) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.listLeft}>
        <View style={styles.listTitleContainer}>
          <Text style={styles.listTextbold}>{title}</Text>
          <Text style={styles.listTextbold}>{weight}</Text>
        </View>
        <View style={styles.listdescription}>
          <Text style={styles.listTextLight}>{invNumber}</Text>
          <Text style={styles.listTextLight}>{location}</Text>
        </View>
      </View>
      <View style={styles.listRight}>
        <View style={styles.listPriceContainer}>
          <Text style={[styles.listTextbold, {color: colors.green}]}>
            {price}
          </Text>
        </View>
        <View>
          <Text style={[styles.listTextLight, {textAlign: 'right'}]}>
            {date}
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 5,
  },
  listTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  listLeft: {
    justifyContent: 'space-between',
  },
  listRight: {
    justifyContent: 'flex-end',
  },
  listdescription: {
    flexDirection: 'row',
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
    marginRight: 10,
  },
  listTextLight: {
    fontWeight: '300',
    color: colors.grey,
    marginRight: 10,
  },
});

export default ListItem;
