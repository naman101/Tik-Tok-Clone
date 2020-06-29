import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import storage from '@react-native-firebase/storage';

const appUsersRef = firestore().collection('users');
const appVideosRef = firestore().collection('videos');

export function signUpUser(email, password) {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created & signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        signInUser(email, password);
      }

      if (error.code === 'auth/invalid-email') {
        Alert.alert('Login Error', 'That email address is invalid!');
      }
    });
}

function signInUser(email, password) {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => console.log('Existing User signed in!'))
    .catch(error => {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Login Error', 'Incorrect Password');
      }
    });
}

async function checkIfUserInFireStore(uid) {
  const documentSnapshot = await appUsersRef.doc(uid).get();
  if (documentSnapshot.exists) {
    return {
      ...documentSnapshot._data,
      id: documentSnapshot.id,
    };
  } else {
    return null;
  }
}

export async function fetchUserFromFireStore(user) {
  const userSnapshot = await checkIfUserInFireStore(user.uid);
  if (userSnapshot) {
    await AsyncStorage.setItem('userDetails', JSON.stringify(userSnapshot));
  } else {
    const userDetails = {
      id: user.uid,
      email: user.email,
    };
    await appUsersRef.doc(user.uid).set(userDetails);
    const newUserSnapshot = await checkIfUserInFireStore(user.uid);
    await AsyncStorage.setItem('userDetails', JSON.stringify(newUserSnapshot));
  }
}

export async function uploadVideo(fileName, fileUri) {
  const fileRef = storage().ref(`${fileName}.mp4`);
  await fileRef.putFile(fileUri);
  const videoUrl = await fileRef.getDownloadURL();
  await appVideosRef.add({
    title: fileName,
    videoUrl,
    timeStamp: new Date().getTime() / 1000,
  });
}

export async function fetchVideosList() {
  const snapshot = await appVideosRef.orderBy('timeStamp', 'desc').get();
  return snapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() };
  });
}
