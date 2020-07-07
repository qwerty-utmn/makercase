const fs = require('fs');
const convert = require('xml-js');
const parseKML = require('parse-kml');

(() => {
  const xml = fs.readFileSync('example2019.kml');
  const json = convert.xml2json(xml, { compact: true, spaces: 4 });
  const { kml } = JSON.parse(json);
  const {
    name: mapName, description: mapDescription, Folder
  } = kml.Document;
  console.log('mapName', mapName);
  console.log('mapDescription', mapDescription);
  // console.log('Folder', Folder);
  for (const { name: folderName, Placemark: placemarks } of Folder) {
    console.log('folderName', folderName);
    for (const {
      name: placemarkName, description: placemarkDescription, ExtendedData: data, Point: point
    } of placemarks) {
      const coordinates = point.coordinates._text.replace(/\s+|\n/g, '');
      const clearPlacemarkName = placemarkName._text ? placemarkName._text.replace(/\s+|\n/g, ' ')
        : placemarkName._cdata.replace(/\s+|\n/g, ' ');
      const clearPlacemarkDescription = placemarkDescription._cdata.replace(/<[^>]*>/g, '');
      const images = data.Data.value._cdata.split(' ');
      console.log('clearPlacemarkName', clearPlacemarkName);
      console.log('clearPlacemarkDescription', clearPlacemarkDescription);
      console.log('images', images);
      console.log('coordinates', coordinates);
    }
  }
  const { statistic, indicators } = JSON.parse(json);
})();
