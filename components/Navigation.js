import { useContext, useState } from 'react';
import { Dimensions } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import MoviesPage from '../pages/moviesPage';
import TVPage from '../pages/tvPage';
import SearchPage from '../pages/searchPage';
import AccountPage from '../pages/accountPage';
import { StateContext } from '../services/state';

function MyComponent() {
  const [index, setIndex] = useState(0);
  const { tabIsReset, resetTab } = useContext(StateContext);
  const windowHeight = Dimensions.get('window').height;

  const barHeight = windowHeight < 750 ? 75 : 100;

  const [routes] = useState([
    {
      key: 'movies', title: 'Movies', focusedIcon: 'movie', unfocusedIcon: 'movie-outline',
    },
    {
      key: 'tv', title: 'TV', focusedIcon: 'television-classic', params: { name: 'hello' },
    },
    {
      key: 'search', title: 'Search', focusedIcon: 'card-search', unfocusedIcon: 'card-search-outline',
    },
    {
      key: 'account', title: 'Me', focusedIcon: 'heart', unfocusedIcon: 'heart-outline',
    },
  ]);

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'movies':
        return <MoviesPage jumpTo={jumpTo} route={route} />;
      case 'tv':
        return <TVPage jumpTo={jumpTo} route={route} />;
      case 'search':
        return <SearchPage jumpTo={jumpTo} route={route} />;
      case 'account':
        return <AccountPage jumpTo={jumpTo} route={route} />;
    }
  };

  return (
    <BottomNavigation
      barStyle={{ height: barHeight }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationType="shifting"
      onTabPress={() => resetTab(true)}
    />
  );
}

export default MyComponent;
