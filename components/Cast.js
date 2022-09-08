import { useEffect, useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Title } from 'react-native-paper';
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cast?.map((member) => (
          <View style={styles.card} key={member}>
            <Image source={{ uri: member }} style={styles.castPhoto} resizeMode="cover" />
          </View>
        ))}

      </ScrollView>
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
  },
  castPhoto: {
    borderRadius: 12,
    height: 125,
    width: 125,
  },
};
