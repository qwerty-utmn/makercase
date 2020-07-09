const fs = require('fs');
const convert = require('xml-js');
const axios = require('axios');
const db = require('../models');

const {
  ArtPlace, Image
} = db;

async function downloadImage(url, name) {
  const path = `../public/static-images/${name}`;

  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream'
  });
  const writer = fs.createWriteStream(path);

  response.data.pipe(writer);

  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
function translite(str) {
  const space = '-';
  str = str.toLowerCase();
  const transl = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'j',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sh',
    ъ: '~',
    ы: 'y',
    ь: '~',
    э: 'e',
    ю: 'yu',
    я: 'ya'
  };
  let link = '';
  for (let i = 0; i < str.length; i++) {
    if (/[а-яё]/.test(str.charAt(i))) { // если текущий символ - русская буква, то меняем его
      link += transl[str.charAt(i)];
    } else if (/[a-z0-9]/.test(str.charAt(i))) {
      link += str.charAt(i); // если текущий символ - английская буква или цифра, то оставляем как есть
    } else {
      if (link.slice(-1) !== space) link += space; // если не то и не другое то вставляем space
    }
  }
  return (link.replace(/~/g, ''));
}

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
      const [lng, lat] = point.coordinates._text.replace(/\s+|\n/g, '').split(',');
      const clearPlacemarkName = placemarkName._text ? placemarkName._text.replace(/\s+|\n/g, ' ').trim()
        : placemarkName._cdata.replace(/\s+|\n/g, ' ').trim();
      const clearPlacemarkDescription = placemarkDescription._cdata.replace(/<img[^>]*>/g, '').replace(/\s+|\n/g, ' ').trim();
      const images = data.Data.value._cdata.split(' ');
      const [artPlace, artPlaceCreated] = await ArtPlace.findOrCreate({
        where: {
          name: clearPlacemarkName,
        },
        defaults: {
          coordinates: [parseFloat(lng), parseFloat(lat)],
          name: clearPlacemarkName,
          description: clearPlacemarkDescription,
          // author_name: ,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      for (const [index, image] of images.entries()) {
        const name = translite(clearPlacemarkName) || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const nameWithExt = `${name}${index}.jpg`;
        await downloadImage(image, nameWithExt);
        await Image.create({
          path: nameWithExt,
          artPlace_id: artPlace.id,
        });
      }
      console.log('clearPlacemarkName', clearPlacemarkName);
    }
  }
})();
