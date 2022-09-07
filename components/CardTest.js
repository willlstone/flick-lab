import React, { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Chip } from 'react-native-paper';
import MasonryList from '@react-native-seoul/masonry-list';
import ImageView from 'react-native-image-viewing';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';

function FurnitureCard({
  item, activeTab, viewPhoto, index,
}) {
  const randomBool = useMemo(() => Math.random() < 0.5, []);

  return (
    <View key={item.id} style={{ marginTop: 12, flex: 1 }}>
      <TouchableOpacity onPress={() => viewPhoto(item.id)}>
        <Image
          source={{ uri: item.imgURL }}
          style={{
            height: randomBool ? 150 : 240,
            alignSelf: 'stretch',
            borderRadius: 12,
            marginRight: 4,
            marginLeft: 4,
          }}
          resizeMode={activeTab === 'logos' ? 'contain' : 'cover'}
        />
      </TouchableOpacity>
    </View>
  );
}

function CardTest({ route }) {
  const [activeTab, setActiveTab] = useState('posters');
  const { images } = route?.params;

  const cleanedImgs = images[activeTab]?.map((image, index) => ({ imgURL: image, id: index, uri: image }));

  const numColumns = activeTab === 'posters' ? 2 : 1;

  const backgroundStyle = {
    flex: 1,
  };

  const renderItem = ({ item, index }) => <FurnitureCard item={item} activeTab={activeTab} viewPhoto={viewPhoto} index={index} />;

  const footerComponent = ({ imageIndex }) => {
    const onShare = async () => {
      const HDImageURL = cleanedImgs[imageIndex].imgURL.replace('w780', 'original').replace('w1280', 'original');

      let downloadedUrl = null;

      const downloadResumable = FileSystem.createDownloadResumable(
        HDImageURL,
        `${FileSystem.documentDirectory}download.jpg`,
        {},
      );

      try {
        const { uri } = await downloadResumable.downloadAsync();
        downloadedUrl = uri;
        // console.log('Finished downloading to ', uri);
      } catch (e) {
        console.error(e);
      }

      try {
        const result = await Share.share({
          url:
            downloadedUrl,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    };

    return (
      <View>
        <Button
          icon="share"
          mode="contained-tonal"
          onPress={onShare}
        >
          Share
        </Button>
        <SafeAreaInsetsContext.Consumer>
          {(insets) => <View style={{ paddingBottom: insets.bottom }} />}
        </SafeAreaInsetsContext.Consumer>
      </View>
    );
  };

  const [visible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewPhoto = (index) => {
    setCurrentIndex(index);
    setIsVisible(true);
  };

  return (
    <SafeAreaView style={backgroundStyle}>

      <ImageView
        images={cleanedImgs}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        FooterComponent={footerComponent}
      />

      <View style={{
        ...styles.rowLeft, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
      }}
      >
        <Chip selected={activeTab === 'posters'} showSelectedOverlay mode="outlined" style={styles.providerChips} onPress={() => setActiveTab('posters')}>Posters</Chip>
        <Chip selected={activeTab === 'images'} showSelectedOverlay mode="outlined" style={styles.providerChips} onPress={() => setActiveTab('images')}>Backdrops</Chip>
        <Chip selected={activeTab === 'logos'} showSelectedOverlay mode="outlined" style={styles.providerChips} onPress={() => setActiveTab('logos')}>Logos</Chip>
      </View>
      <MasonryList
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<View />}
        contentContainerStyle={{
          paddingHorizontal: 24,
          alignSelf: 'stretch',
        }}
        numColumns={numColumns}
        data={cleanedImgs || []}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = {
  providerChips: {
    marginRight: 10,
    marginBottom: 10,
  },
  rowLeft: {
    paddingHorizontal: 30,
  },
  footerButton: {
    width: '100%',
    marginTop: 10,
  },
};

export default CardTest;
