import React from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  TouchableHighlight,
  ToastAndroid,
} from 'react-native';

import SendIntentAndroid from 'react-native-send-intent';
import AsyncStorage from '@react-native-community/async-storage';

const DetailView = props => {
  const {isVisible, contact, onClose, onFavoriteChange} = props;

  const callNumber = number => {
    SendIntentAndroid.sendPhoneCall(number, true);
  };

  const toggleFavoriteStatus = async () => {
    const favoritesString = await AsyncStorage.getItem('favorites');
    let favoritesArray = [];

    if (favoritesString !== null) {
      favoritesArray = favoritesString.split(',');
      if (favoritesArray.includes(contact.recordID)) {
        // contact was favorite, remove it
        favoritesArray.splice(favoritesArray.indexOf(contact.recordID), 1);
        ToastAndroid.show('Uklonjen iz favorita.', ToastAndroid.SHORT);
      } else {
        // contact should become favorite
        favoritesArray.push(contact.recordID);
        ToastAndroid.show('Dodan u favorite', ToastAndroid.SHORT);
      }
    } else {
      // current becomes first and only favorite
      favoritesArray.push(contact.recordID);
      ToastAndroid.show('Dodan u favorite', ToastAndroid.SHORT);
    }

    // save state
    await AsyncStorage.setItem('favorites', favoritesArray.join(','));
    onFavoriteChange();
  };

  const renderNumbers = () => {
    const {phoneNumbers} = contact;
    if (!phoneNumbers) {
      return;
    }

    return phoneNumbers.map(({label, number}) => {
      return (
        <TouchableHighlight
          underlayColor="lightgray"
          key={number}
          onPress={() => callNumber(number)}>
          <View style={styles.numberPair}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.number}>{number}</Text>
          </View>
        </TouchableHighlight>
      );
    });
  };

  const renderContact = () => {
    if (!contact) {
      return;
    }

    return (
      <>
        <TouchableHighlight
          underlayColor="cyan"
          onLongPress={toggleFavoriteStatus}>
          <View style={styles.contactNameContainer}>
            <Text style={styles.contactFont}>{contact.givenName}</Text>
            <Text style={styles.contactFont}>{contact.familyName}</Text>
          </View>
        </TouchableHighlight>
        <ScrollView style={styles.numbersContainer}>
          {renderNumbers()}
        </ScrollView>
      </>
    );
  };
  return (
    <Modal
      visible={isVisible}
      style={styles.modal}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.closeBtnContainer}>
        <Button
          title="<---------- Return"
          onPress={onClose}
          color="brown"
          style={styles.closeBtn}
        />
      </View>
      {renderContact()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 50,
  },
  closeBtnContainer: {
    padding: 10,
    marginTop: 20,
    marginHorizontal: 10,
  },
  contactNameContainer: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  contactFont: {
    fontSize: 48,
    paddingLeft: 10,
  },
  numbersContainer: {
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  numberPair: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 40,
  },
  number: {
    fontSize: 30,
  },
});

export default DetailView;
