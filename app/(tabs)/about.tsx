import { ImageBackground, Platform } from 'react-native';
import { styles, typography } from '../../styles/theme';
import { Text, View } from 'react-native';

const cardSource = Platform.OS === 'web'
  ? require('../../assets/cards/card-w10-cracked@web.png')
  : require('../../assets/cards/card-w10-cracked.png');

export default function AboutScreen() {
  return (
    <ImageBackground
      source={cardSource}
      style={[styles.screen, { width: '100%', height: '100%' }]}
      resizeMode="cover"
    >
      <View style={styles.screenCentered}>
        <View style={styles.card}>
          <Text style={typography.h2}>About screen</Text>
          <Text style={typography.body}>Today I felt...</Text>
        </View>
      </View>
    </ImageBackground>
  );
}
