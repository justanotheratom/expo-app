import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import domtoimage from 'dom-to-image';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

const PlaceholderImage = require('./assets/images/background.png')

export default function App() {

  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionStatus, requestPermission] = MediaLibrary.usePermissions()
  const imageRef = useRef();

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsExiting: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.')
    }
  }

  const onReset = () => {
    setPickedEmoji(null);
    setSelectedImage(null);
    setShowAppOptions(false);
  }

  const onAddSticker = () => {
    setIsModalVisible(true);
  }

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        if (permissionStatus === null || permissionStatus.status === 'denied') {
          console.log("Requesting permission")
          requestPermission();
        }

        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        })

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Image saved successfully!')
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      domtoimage
        .toJpeg(imageRef.current, { quality: 1 })
        .then(dataUrl => {
          let link = document.createElement('a')
          link.download = 'my-image-name.jpeg'
          link.href = dataUrl
          link.click()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const onModalClose = () => {
    setIsModalVisible(false);
  }

  return (
    <GestureHandlerRootView style={styles.container}>

      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
          {
            pickedEmoji &&
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          }
        </View>
      </View>

      {
        showAppOptions
        ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset}/>
              <CircleButton onPress={onAddSticker}/>
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync}/>
            </View>
          </View>
        )
        : (
          <View style={styles.footerContainer}>
            <Button label="Choose a photo" theme="primary" onPress={pickImageAsync}/>
            <Button label="Use this photo" onPress={() => setShowAppOptions(true)}/>
          </View>
        )
      }

      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
      </EmojiPicker>

      <StatusBar style="auto" />

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292E',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  }
});
