import React from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import Marker from '../Marker/Marker';

export default class ArtMap extends React.Component {
  constructor(props) {
    super(props);
    const { mapOptions, artObjects } = props;
    this.state = { mapOptions, artObjects };
    this.getArtObjects().then(result => {
      this.setState({ artObjects: result });
    });
  }

  async getArtObjects() {
    const res = await axios.get('http://localhost:3000/artPlaces');
    return res.data;
  }

  render() {
    const { center, zoom } = this.state.mapOptions;
    const { artObjects } = this.state;
    return (
      <div style={{ width: '100%', height: 'calc(100vh - 64px)' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCJTm8QajP4RjJCtFmYeReQDfuKJXIPiO0' }}
          defaultCenter={center}
          defaultZoom={zoom}>
          {console.log('aaa')}
          {artObjects && this.state.artObjects.map((artObject, markerKey) => <Marker key={markerKey} lat={artObject.coordinates[1]} lng={artObject.coordinates[0]} />)}
        </GoogleMapReact>
      </div>);
  }
}