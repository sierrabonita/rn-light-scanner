import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-media-library';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';

export default function Index() {
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  const startScan = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Error', 'Permission required to access Photos.');
        return;
      }

      const { scannedImages } = await DocumentScanner.scanDocument({ maxNumDocuments: 1 });

      if (scannedImages && scannedImages.length > 0) {
        const imageUri = scannedImages[0];
        setScannedImage(imageUri);

        await Asset.create(imageUri);

        Alert.alert('Success', 'Corrected image saved to Photos!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while scanning or saving.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Scanner</Text>
      <TouchableOpacity style={styles.button} onPress={startScan}>
        <Text style={styles.buttonText}>Start Scan</Text>
      </TouchableOpacity>
      {scannedImage && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Recent Scans:</Text>
          <Image source={{ uri: scannedImage }} style={styles.previewImage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  previewImage: {
    width: 200,
    height: 280,
    resizeMode: 'contain',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
