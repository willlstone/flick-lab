import React from 'react';
import { Paragraph } from 'react-native-paper';

function Overview({ text }) {
  return (
    <Paragraph style={styles.text}>
      {text}
    </Paragraph>
  );
}

const styles = {
  text: {
    margin: 24,
    fontSize: 16,
    marginBottom: 10,
  },
};

export default Overview;
