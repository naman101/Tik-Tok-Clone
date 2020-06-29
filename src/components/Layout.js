import React from 'react';
import { View, StyleSheet } from 'react-native';
import { getww, getwh } from '../utils/layout';

export default function Layout({ children }) {
  return <View style={styles.layoutContainer}>{children}</View>;
}

const styles = StyleSheet.create({
  layoutContainer: {
    width: getww(92),
    marginLeft: getww(4),
    marginTop: getwh(2),
    flex: 1,
  },
});
