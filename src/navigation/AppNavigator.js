import * as React from 'react';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { themeColors } from '../utils/colors';
import Home from '../containers/Home';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '../components/ThemedComponents';
import { elevationShadowStyle, getwh, getww } from '../utils/layout';
import RecordVideo from '../containers/RecordVideo';
import { navigationRef, navigate } from '../services/navigationService';
import Login from '../containers/Login';
import auth from '@react-native-firebase/auth';
import { fetchUserFromFireStore } from '../services/firebaseService';
import AsyncStorage from '@react-native-community/async-storage';

const appTheme = {
  dark: true,
  colors: {
    ...themeColors,
  },
};

const BottomTab = createBottomTabNavigator();
const AppStack = createStackNavigator();

function SignOutButton() {
  const {
    colors: { border },
  } = useTheme();

  const signOut = React.useCallback(async () => {
    auth().signOut();
    await AsyncStorage.removeItem('userDetails');
  }, []);

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={signOut}>
      <Text style={[styles.buttonText, { color: border }]}>SIGN OUT</Text>
    </TouchableOpacity>
  );
}

function HomeStackNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{ headerRight: () => <SignOutButton /> }}
      />
      <AppStack.Screen
        name="RecordVideo"
        component={RecordVideo}
        options={{
          headerTransparent: true,
          title: null,
          headerBackTitleVisible: false,
        }}
      />
    </AppStack.Navigator>
  );
}

function BottomTabNavigator() {
  const {
    colors: { border },
  } = useTheme();

  return (
    <>
      <BottomTab.Navigator
        tabBarOptions={{ showLabel: false, style: { height: getwh(7) } }}>
        <BottomTab.Screen name="BottomTab" component={Home} />
      </BottomTab.Navigator>
      <TouchableOpacity
        style={[{ backgroundColor: border }, styles.addButton]}
        onPress={() => navigate('RecordVideo')}>
        <ThemedText isReverse={true} style={styles.addIcon}>
          +
        </ThemedText>
      </TouchableOpacity>
    </>
  );
}

function LoginStackNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
    </AppStack.Navigator>
  );
}

export default function App() {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState(null);

  const onAuthStateChanged = React.useCallback(
    async userDetails => {
      if (userDetails) {
        await fetchUserFromFireStore(userDetails);
      }
      setUser(userDetails);
      if (initializing) {
        setInitializing(false);
      }
    },
    [initializing],
  );

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  if (initializing) {
    return null;
  } else {
    return (
      <NavigationContainer theme={appTheme} ref={navigationRef}>
        {user ? <HomeStackNavigator /> : <LoginStackNavigator />}
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  addButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: getwh(3.5),
    alignSelf: 'center',
    ...elevationShadowStyle(3),
    zIndex: 99,
  },
  addIcon: {
    fontSize: 40,
  },
  buttonContainer: {
    marginRight: getww(4),
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
