import { ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';

const cardSource = Platform.OS === 'web'
  ? require('../../assets/cards/card-w11-marble@web.png')
  : require('../../assets/cards/card-w11-marble.png');

export default function HistoryScreen() {
  return (
    <ImageBackground
      source={cardSource}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.text}>History screen</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
