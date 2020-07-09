//
// Copyright 2020 DxOS.org
//

import hash from 'string-hash';

import BlueImage from './images/blue.jpg';
import BlueWaveImage from './images/blue-wave.jpg';
import DarkImage from './images/dark.jpg';
import GrayImage from './images/gray.jpg';
import OrangeImage from './images/orange.jpg';
import RedImage from './images/red.jpg';

// TODO(burdon): Copyright?
// https://www.freepik.com/premium-vector/collection-ten-backgrounds-with-blue-paper-cut_4647794.htm#page=1&query=layers&position=3

const images = [
  BlueImage,
  GrayImage,
  DarkImage,
  RedImage,
  OrangeImage,
  BlueWaveImage
];

export const getThumbnail = (value) => {
  return images[hash(value) % images.length];
};
