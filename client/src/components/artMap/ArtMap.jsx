import React, { useEffect, useState } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from 'react-google-maps';

function Map(props) {
  const { artObjects } = props;
  return <GoogleMap
    defaultZoom={12}
    defaultCenter={{ lat: 57.142424, lng: 65.555071 }}
  >
    {artObjects && artObjects.map((artObject, key) => <Marker key={key} position={{ lat: artObject.coordinates[1], lng: artObject.coordinates[0] }} />)}
  </GoogleMap>
}

const WrappedMap = withScriptjs(withGoogleMap(Map))

export default function ArtMap(props) {
  const [artObjects, setArtObjects] = useState([]);

  return (
    <div>
      <WrappedMap
        artObjects={artObjects}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCJTm8QajP4RjJCtFmYeReQDfuKJXIPiO0&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `840px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}