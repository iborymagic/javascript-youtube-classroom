import { YOUTUBE_API_KEY } from './config.js';
import { dummyData } from './dummy.js';

export const searchYoutube = async (keyword, pageToken = '') => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${keyword}&pageToken=${pageToken}&maxResults=10&key=${YOUTUBE_API_KEY}`
  );

  return response.json();
};

export const searchYoutubeDummyData = async (keyword, pageToken = '') => {
  return dummyData[0];
};
