import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

export default (): JSX.Element => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator />
      <Text style={styles.spinnerText}>
        Fetching Data...
      </Text>
    </View>
  );
};

const styles = {
  spinnerContainer: {
    flex: 1,
    // justifyContent: "center"
    // alignItems: 'center'
  },
  spinnerText: {
    color: 'gray',
    marginTop: 12,
  },
};
