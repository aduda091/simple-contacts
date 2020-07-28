import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StatusBar,
  StyleSheet,
  PermissionsAndroid,
  View,
  TouchableHighlight,
} from 'react-native';

import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-community/async-storage';

import DetailView from './components/detailView';

const App = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      ],
      {
        title: 'SimpleContacts',
        message:
          'This app requires your permission to access contacts and calling',
      },
    ).then(() => {
      loadContacts();
    });
  }, []);

  async function loadContacts() {
    Contacts.getAll(async (err, contacts) => {
      if (err === 'denied') {
        console.warn('Permission to access contacts was denied');
      } else {
        const sortedContacts = contacts.sort((a, b) => {
          const nameA = a.givenName.toUpperCase();
          const nameB = b.givenName.toUpperCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });

        setAllContacts(sortedContacts);

        getFavorites(sortedContacts);
      }
    });
  }

  async function getFavorites(contacts) {
    // favorites
    try {
      const favoritesString = await AsyncStorage.getItem('favorites');
      if (favoritesString !== null) {
        const favoritesArray = favoritesString.split(',');
        let targetContacts = allContacts.length ? allContacts : contacts;
        let favs = targetContacts.filter(contact => {
          return favoritesArray.includes(contact.recordID);
        });

        setFavorites(favs);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  function renderContacts(contacts) {
    return contacts.map(contact => {
      return (
        <TouchableHighlight
          underlayColor="#ccc"
          key={contact.recordID}
          onPress={() => {
            onContactPress(contact);
          }}>
          <View style={styles.contactElement}>
            <Text style={styles.contactFont}>{contact.givenName}</Text>
            <Text style={styles.contactFont}>{contact.familyName}</Text>
          </View>
        </TouchableHighlight>
      );
    });
  }

  function onContactPress(contact) {
    setActiveContact(contact);
    setIsModalVisible(true);
  }

  function closeDetailView() {
    setActiveContact(null);
    setIsModalVisible(false);
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <DetailView
        isVisible={isModalVisible}
        contact={activeContact}
        onClose={closeDetailView}
        onFavoriteChange={loadContacts}
      />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          {renderContacts(favorites)}

          <Text style={styles.sectionTitle}>All contacts</Text>
          {renderContacts(allContacts)}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 15,
  },
  contactFont: {
    fontSize: 48,
  },
  contactElement: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    padding: 5,
  },
  sectionTitle: {
    color: 'firebrick',
    fontSize: 30,
    fontWeight: 'bold',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    textAlign: 'center',
  },
});

export default App;
