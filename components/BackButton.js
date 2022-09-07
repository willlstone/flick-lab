import { IconButton, useTheme } from 'react-native-paper';
import { View } from 'react-native';

export default function BackButton({ onPress }) {
  const { colors } = useTheme();
  return (
    <View style={{
      position: 'absolute', top: 20, left: 20, zIndex: 9,
    }}
    >
      <IconButton
        icon="arrow-left-circle"
        iconColor={colors.primary}
        size={40}
        onPress={onPress}
      />
    </View>
  );
}
