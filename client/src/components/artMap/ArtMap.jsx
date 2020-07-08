import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

const Marker = ({ text }) => <div>{text}</div>;

export default function ArtMap({ mapOptions }) {
  const { center, zoom } = mapOptions;
  const [artObjects, setArtObjects] = useState([]);
  useEffect(() => {
    async function getArtObjects() {
      const res = await axios.get('http://localhost:3000/artPlaces');
      setArtObjects(res.data);
    };
    getArtObjects();
  }, []);
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 64px)' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCJTm8QajP4RjJCtFmYeReQDfuKJXIPiO0' }}
        defaultCenter={center}
        defaultZoom={zoom}>
        {/* {artObjects.map((artObject, markerKey) => <Marker key={markerKey} lat={artObject.coordinates[0]} lng={artObject.coordinates[1]} text={"123"} />)} */}
      </GoogleMapReact>
    </div>);
}