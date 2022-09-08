// import ExploreView from "../components/ExploreView";
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Details from "../components/MovieDetails";
// import Discover from "../components/Discover";
// import CardTest from "../components/CardTest";

// const Stack = createNativeStackNavigator();

// export default function AccountPage({ jumpTo }) {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//       screenOptions={{
//         headerShown: false
//       }}>
//         <Stack.Screen
//           name="Discover"
//           component={Discover}
//         />
//         <Stack.Screen name="Explore" component={ExploreView} />
//         <Stack.Screen name="Details" component={Details} />
//         <Stack.Screen name="Images" component={CardTest} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

import * as React from 'react';
import { SegmentedButtons } from 'react-native-paper';

const MyComponent = () => {
  const [value, setValue] = React.useState('');

  return (
    <SegmentedButtons
     value={value}
     onValueChange={setValue}
     buttons={[
       {
         value: 'walk',
         label: 'Walking',
       },
       {
         value: 'train',
         label: 'Transit',
       },
     ]}
     style={styles.group}
   />
  );
};

const styles = {
  group: {
    marginTop: 40,
  }
}

export default MyComponent;