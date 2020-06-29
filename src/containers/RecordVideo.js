import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useTheme } from '@react-navigation/native';
import {
  ThemedText,
  ThemedActivityIndicator,
} from '../components/ThemedComponents';
import { getww, getwh, elevationShadowStyle } from '../utils/layout';
import { TextInput } from 'react-native-gesture-handler';
import { uploadVideo } from '../services/firebaseService';

export default function RecordVideo() {
  const {
    colors: { border, background, text, secondaryText },
  } = useTheme();
  const cameraRef = React.useRef();
  const [isBackCamera, setBackCamera] = React.useState(true);
  const [isRecording, setRecording] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [videoTitle, setVideoTitle] = React.useState('');
  const [videoUri, setVideoUri] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);

  const onRecordingComplete = React.useCallback(() => {
    setRecording(false);
    setModalVisible(true);
  }, []);

  const handleRecording = React.useCallback(async () => {
    if (!isRecording) {
      const { uri } = await cameraRef.current.recordAsync({ maxDuration: 10 });
      setVideoUri(uri);
    } else {
      cameraRef.current.stopRecording();
    }
  }, [isRecording]);

  const addVideoToDb = React.useCallback(async () => {
    setUploading(true);
    await uploadVideo(videoTitle, videoUri);
    setVideoUri(null);
    setVideoTitle('');
    setUploading(false);
    setModalVisible(false);
    Alert.alert('Operation Successful', 'Video was uploaded successfully');
  }, [videoTitle, videoUri]);

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={
          isBackCamera
            ? RNCamera.Constants.Type.back
            : RNCamera.Constants.Type.front
        }
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onRecordingStart={() => setRecording(true)}
        onRecordingEnd={onRecordingComplete}
      />
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={[{ backgroundColor: border }, styles.bottomButton]}
          onPress={handleRecording}>
          <ThemedText isReverse={true} style={styles.buttonText}>
            {!isRecording ? 'RECORD' : 'STOP'}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[{ backgroundColor: border }, styles.bottomButton]}
          onPress={() => setBackCamera(!isBackCamera)}>
          <ThemedText isReverse={true} style={styles.buttonText}>
            {!isBackCamera ? 'Back Camera' : 'Front Camera'}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        hardwareAccelerated={true}>
        <View style={styles.videoNameContainer}>
          <View
            style={[styles.videoNameContent, { backgroundColor: background }]}>
            <TextInput
              placeholder="Enter Video Title"
              value={videoTitle}
              onChangeText={value => setVideoTitle(value)}
              style={[styles.input, { color: text, borderColor: text }]}
              placeholderTextColor={secondaryText}
              textAlign="center"
              autoFocus={true}
              multiline={true}
            />
            {uploading ? (
              <View style={styles.loadingContainer}>
                <ThemedActivityIndicator />
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: border }]}
                onPress={addVideoToDb}>
                <ThemedText style={styles.textStyle} isReverse={true}>
                  Upload
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomButton: {
    width: getww(30),
    height: getwh(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: getwh(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '96%',
    marginLeft: '2%',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  videoNameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoNameContent: {
    borderRadius: 4,
    width: getww(80),
    height: getwh(30),
    justifyContent: 'space-between',
    alignItems: 'center',
    ...elevationShadowStyle(5),
    paddingVertical: getwh(2),
  },
  input: {
    borderBottomWidth: 1,
    width: '90%',
  },
  submitButton: {
    borderRadius: 4,
    padding: 10,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
