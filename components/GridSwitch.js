import { IconButton, useTheme } from 'react-native-paper';
import { View } from 'react-native';

export default function GridSwitch({ onPress, icon }) {
  const { colors } = useTheme();
  return (
    <View style={{
      position: 'absolute', top: 20, right: 20, zIndex: 9,
    }}
    >
      <IconButton
        icon={icon}
        iconColor={colors.primary}
        size={40}
        onPress={onPress}
      />
    </View>
  );
}