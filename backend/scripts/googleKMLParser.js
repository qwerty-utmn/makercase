const fs = require('fs');
const convert = require('xml-js');
const axios = require('axios');
const db = require('../models');

const {
  ArtPlace, Image
} = db;

(async () => {
  const xml = fs.readFileSync('example2019.kml');
  const json = convert.xml2json(xml, { compact: true, spaces: 4 });
  const { kml } = JSON.parse(json);
  const {
    name: mapName, description: mapDescription, Folder
  } = kml.Document;
  // console.log('Folder', Folder);
  for (const { name: folderName, Placemark: placemarks } of Folder) {
    for (const {
      name: placemarkName, description: placemarkDescription, ExtendedData: data, Point: point
    } of placemarks) {
      const [lat, lng] = point.coordinates._text.replace(/\s+|\n/g, '').split(',');
      const clearPlacemarkName = placemarkName._text ? placemarkName._text.replace(/\s+|\n/g, ' ')
        : placemarkName._cdata.replace(/\s+|\n/g, ' ');
      const clearPlacemarkDescription = placemarkDescription._cdata.replace(/<[^>]*>/g, '');
      const images = data.Data.value._cdata.split(' ');
      const [artPlace, artPlaceCreated] = await ArtPlace.findOrCreate({
        where: {
          name: clearPlacemarkName,
        },
        defaults: {
          coordinates: [parseFloat(lat), parseFloat(lng)],
          name: clearPlacemarkName,
          description: clearPlacemarkDescription,
          // author_name: ,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      for (const image of images) {
        const response = await axios
          .get(image, {
            responseType: 'arraybuffer'
          });
        const buffer = Buffer.from(response.data, 'base64');
        await Image.create({
          data: buffer,
          artPlace_id: artPlace.id,
        });
      }
      console.log('clearPlacemarkName', clearPlacemarkName);
    }
  }
})();
