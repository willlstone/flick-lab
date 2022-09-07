import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

console.log({ windowHeight });
console.log({ windowWidth });

// used to be 350 then 500
export const BANNER_H = 650;
export const TOPNAVI_H = 50;
