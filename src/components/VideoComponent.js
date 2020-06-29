import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { ThemedText } from './ThemedComponents';
import { getwh, getww } from '../utils/layout';
import { useIsFocused } from '@react-navigation/native';

export default function VideoComponent({ video, currentId }) {
  const [playing, setPlaying] = React.useState(true);
  const player = React.useRef();
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (!isFocused) {
      setPlaying(false);
    }
  }, [isFocused]);

  return (
    <TouchableOpacity onPress={() => setPlaying(!playing)}>
      <Video
        ref={player}
        source={{ uri: video.videoUrl }}
        resizeMode="cover"
        style={styles.backgroundVideo}
        bufferConfig={{
          minBufferMs: 2000,
          maxBufferMs: 10000,
          bufferForPlaybackMs: 1500,
          bufferForPlaybackAfterRebufferMs: 1500,
        }}
        onLoad={() => player.current.seek(0)}
        paused={!(currentId === video.id && playing)}
        repeat
      />
      <ThemedText style={styles.title}>{video.title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    width: getww(100),
    height: getwh(100),
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    bottom: getwh(6),
    alignSelf: 'center',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 0 },
    textShadowRadius: 10,
    fontSize: 18,
  },
});
