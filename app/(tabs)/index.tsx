import { Link } from 'expo-router';
import { ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';

const cardSource = Platform.OS === 'web'
  ? require('../../assets/cards/card-w9-frieze@web.png')
  : require('../../assets/cards/card-w9-frieze.png');

export default function Index() {
  return (
    <ImageBackground
      source={cardSource}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.text}>Home screen</Text>
        <Link href="/about" style={styles.button}>
          Go to About screen
        </Link>
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
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
