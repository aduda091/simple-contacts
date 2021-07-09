import React from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';

const CallLogView = props => {
  const {isVisible, logs, contacts, onClose} = props;

  const standardizePhoneNumber = number => {
    return number.replace('+385', '0').replace(/\D/g, '');
  };

  const findNameByPhone = phoneNumber => {
    const translatedNumber = standardizePhoneNumber(phoneNumber);
    const foundContact = contacts.find(contact => {
      const {phoneNumbers} = contact;
      return phoneNumbers.some(
        number => standardizePhoneNumber(number.number) === translatedNumber,
      );
    });
    if (!foundContact) {
      return {givenName: 'Unknown'};
    }
    return {
      givenName: foundContact.givenName,
      familyName: foundContact.familyName,
    };
  };

  const callNumber = number => {
    SendIntentAndroid.sendPhoneCall(number, true);
  };

  const formatDateTime = timestamp => {
    const dateTime = new Date(Number(timestamp));
    const date = dateTime.toLocaleDateString('hr');
    const time = dateTime.toLocaleTimeString('hr');
    return `${date} ${time}`;
  };

  const renderLogs = () => {
    if (!logs.length) {
      return;
    }

    return logs.map(log => {
      const {givenName, familyName} = findNameByPhone(log.phoneNumber);
      return (
        <TouchableHighlight
          underlayColor="cyan"
          key={log.timestamp}
          onPress={() => callNumber(log.phoneNumber)}>
          <View style={styles.contactNameContainer}>
            {givenName ? (
              <Text style={styles.contactFont}>{givenName}</Text>
            ) : null}
            {familyName ? (
              <Text style={styles.contactFont}>{familyName}</Text>
            ) : null}
            {givenName === 'Unknown' ? (
              <Text style={styles.number}>{log.phoneNumber}</Text>
            ) : null}
            {log.timestamp && (
              <Text style={styles.contactFont}>
                {formatDateTime(log.timestamp)}
              </Text>
            )}
          </View>
        </TouchableHighlight>
      );
    });
  };
  return (
    <Modal
      visible={isVisible}
      style={styles.modal}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.closeBtnContainer}>
        <Button title="<---------- Return" onPress={onClose} color="brown" />
      </View>
      <ScrollView style={styles.numbersContainer}>{renderLogs()}</ScrollView>
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
  number: {
    fontSize: 30,
  },
});

export default CallLogView;
