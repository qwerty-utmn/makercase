import React, { useState } from 'react';
import {
  GoogleMap, withScriptjs, withGoogleMap, Marker,
} from 'react-google-maps';

function Map({ artObjects, markerOnClick }) {
  const [createObjectMarker, setObjectMarker] = useState();
  return (
    <GoogleMap
      onRightClick={(e) => {
        setObjectMarker({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          show: true,
        });
      }}
      defaultZoom={12}
      defaultCenter={{ lat: 57.142424, lng: 65.555071 }}
    >
      {(createObjectMarker && createObjectMarker.show)
      && (
        <React.Fragment>
      <Marker
        position={{ lat: createObjectMarker.lat, lng: createObjectMarker.lng }}
      />
      </React.Fragment>
      )}
      {artObjects && artObjects.map(
        (artObject, key) => (
          <Marker
            key={key}
            position={{ lat: artObject.coordinates[1], lng: artObject.coordinates[0] }}
            onClick={() => {
              markerOnClick(artObject);
            }}
          />
        ))}
    </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function ArtMap({ artObjects, markerOnClick }) {
  return (
    <div style={{ height: '93%' }}>
      <WrappedMap
        artObjects={artObjects}
        markerOnClick={markerOnClick}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCJTm8QajP4RjJCtFmYeReQDfuKJXIPiO0&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
      />
    </div>
  );
}
