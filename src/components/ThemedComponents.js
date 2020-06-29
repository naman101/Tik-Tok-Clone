import * as React from 'react';
import { useTheme } from '@react-navigation/native';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

export function ThemedText({ style, children, isReverse, numberOfLines }) {
  const {
    colors: { text, card },
  } = useTheme();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ color: isReverse ? card : text }, style]}>
      {children}
    </Text>
  );
}

export function ThemedSafeAreaView({ children, isBackGround }) {
  const {
    colors: { card, background },
  } = useTheme();
  return (
    <SafeAreaView
      style={[
        styles.safeViewContainer,
        { backgroundColor: isBackGround ? background : card },
      ]}>
      {children}
    </SafeAreaView>
  );
}

export function ThemedActivityIndicator() {
  const {
    colors: { text },
  } = useTheme();
  return <ActivityIndicator size="small" color={text} />;
}

const styles = StyleSheet.create({
  safeViewContainer: {
    flex: 1,
  },
});
