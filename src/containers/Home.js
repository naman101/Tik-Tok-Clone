import * as React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import VideoComponent from '../components/VideoComponent';
import { fetchVideosList } from '../services/firebaseService';
import { useIsFocused } from '@react-navigation/native';
import { ThemedText } from '../components/ThemedComponents';
import { getww } from '../utils/layout';

export default function Home() {
  const [videosList, setVideosList] = React.useState([]);
  const [currentId, setCurrentId] = React.useState('');
  const isFocused = useIsFocused();

  const fetchVideos = React.useCallback(async () => {
    const tempList = await fetchVideosList();
    setVideosList(tempList);
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      fetchVideos();
    }
  }, [fetchVideos, isFocused]);

  const updateCurrentId = React.useCallback(id => {
    setCurrentId(id);
  }, []);

  const onViewRef = React.useRef(({ viewableItems }) => {
    if (viewableItems[0]) {
      setCurrentId(viewableItems[0].key);
    }
  });

  return (
    <FlatList
      horizontal
      data={videosList}
      onViewableItemsChanged={onViewRef.current}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <VideoComponent
          video={item}
          currentId={currentId}
          onPlay={updateCurrentId}
        />
      )}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyListContainer}>
          <ThemedText style={styles.emptyText}>List is empty</ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: getww(100),
  },
  emptyText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
