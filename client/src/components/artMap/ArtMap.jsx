import React from 'react';
import GoogleMapReact from 'google-map-react';

export default function ArtMap({mapOptions}) {
  const { center, zoom } = mapOptions;
  return (<div style={{ width: '100%', height: 'calc(100vh - 64px)' }}>
    <GoogleMapReact
      bootstrapURLKeys={{ key: 'AIzaSyCJTm8QajP4RjJCtFmYeReQDfuKJXIPiO0' }}
      defaultCenter={center}
      defaultZoom={zoom} />
  </div>);
}