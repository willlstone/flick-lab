import { useEffect, useState } from 'react';
import { View, Image, FlatList } from 'react-native';
import { Title, Text, Caption } from 'react-native-paper';
import { fetchCast } from '../services/api';

export default function Cast({ id, category }) {
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setCast(await fetchCast(id, category));
    };
    fetchData();
  }, [id]);

  if (cast?.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Title style={styles.rowHeader}>Cast</Title>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={cast}
        initialNumToRender={3}
        renderItem={({ item, index }) => {
          const { pic, actorName, characterName } = item;
          return (
            <View style={styles.card} key={actorName}>
              <Image source={{ uri: pic }} style={styles.castPhoto} resizeMode="cover" />
              <Text>{actorName}</Text>
              <Caption>{characterName}</Caption>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = {
  container: {
    marginLeft: 24,
  },
  rowHeader: {
    marginBottom: 10,
    fontWeight: '800',
  },
  card: {
    marginRight: 12,
    borderRadius: 12,
    marginBottom: 10,
    width: 125,
  },
  castPhoto: {
    borderRadius: 12,
    height: 125,
    width: 125,
  },
};
