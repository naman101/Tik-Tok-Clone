import * as React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { getwh, getww, elevationShadowStyle } from '../utils/layout';
import { ThemedText } from '../components/ThemedComponents';
import { useTheme } from '@react-navigation/native';
import Layout from '../components/Layout';
import { signUpUser } from '../services/firebaseService';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordRef = React.useRef();
  const {
    colors: { text, border, secondaryText },
  } = useTheme();
  return (
    <Layout>
      <ThemedText style={styles.logo}>TIKTOK CLONE</ThemedText>
      <View style={styles.loginContent}>
        <ThemedText style={styles.loginHeader}>SIGN IN!</ThemedText>
      </View>
      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={value => setEmail(value)}
        onSubmitEditing={() => passwordRef.current.focus()}
        style={[styles.input, { color: text, borderColor: text }]}
        placeholderTextColor={secondaryText}
      />
      <TextInput
        placeholder="Enter Password"
        ref={passwordRef}
        value={password}
        onChangeText={value => setPassword(value)}
        style={[styles.input, { color: text, borderColor: text }]}
        placeholderTextColor={secondaryText}
        secureTextEntry={true}
        onSubmitEditing={() => signUpUser(email, password)}
      />
      <TouchableOpacity
        style={[styles.buttonContainer, { backgroundColor: border }]}
        onPress={() => signUpUser(email, password)}>
        <ThemedText isReverse={true} style={styles.buttonText}>
          Sign In
        </ThemedText>
      </TouchableOpacity>
    </Layout>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
    marginTop: getwh(7),
  },
  loginContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getwh(10),
  },
  loginHeader: {
    fontSize: 20,
    marginBottom: getwh(5),
  },
  input: {
    borderWidth: 1,
    borderRadius: 26,
    marginTop: getwh(4),
    paddingLeft: getww(6),
  },
  buttonContainer: {
    marginTop: getwh(5),
    width: '50%',
    height: getwh(6),
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    ...elevationShadowStyle(4),
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
