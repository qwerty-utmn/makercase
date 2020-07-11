import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow,
} from 'react-google-maps';
import {
  TextField,
  InputLabel,
  OutlinedInput,
  FormControl,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';

const { MarkerClusterer } = require('react-google-maps/lib/components/addons/MarkerClusterer');
const { MarkerWithLabel } = require('react-google-maps/lib/components/addons/MarkerWithLabel');
const { SearchBox } = require('react-google-maps/lib/components/places/SearchBox');
const placeIcon = require('../../images/wall.svg');
const artIcon = require('../../images/art.svg');
const m1 = require('../../images/m1.png');
const m2 = require('../../images/m2.png');
const m3 = require('../../images/m3.png');
const m4 = require('../../images/m4.png');
const m5 = require('../../images/m5.png');

const API_KEY = 'AIzaSyCJTm8QajP4RjJCtFmYeReQDfuKJXIPiO0';

function Map({ artObjects, markerOnClick, ...props }) {
  const [createdObject, setCreatedObject] = useState();
  const [isCreatePopUpOpen, toggleCreatePopUpOpen] = useState(false);
  const [addPlaceForm, setAddPlaceForm] = useState({ address: '', description: '', images: [] });
  const [addPlaceFormErrors, setAddPlaceFormErrors] = useState({ address: '', description: '' });
  const [bounds, setBounds] = useState(null);
  const [center, setCenter] = useState({ lat: 57.142424, lng: 65.555071 });
  const [searchMarker, setSearchMarker] = useState(null);

  const refSearchBox = useRef(null);
  const refSearchInput = useRef(null);
  const refMap = useRef(null);

  const handleAddPlaceForm = (e) => {
    setAddPlaceForm({ ...addPlaceForm, [e.target.name]: e.target.value });
    setAddPlaceFormErrors({ ...addPlaceFormErrors, [e.target.name]: e.target.value.length === 0 ? 'Не может быть пусто' : '' });
  };

  const validateAllFieds = () => {
    const newAddPlaceFormErrors = Object.keys(addPlaceFormErrors).reduce((a, c) => {
      return { ...a, [c]: addPlaceForm[c].length === 0 ? 'Не может быть пусто' : '' };
    }, {});
    console.log(newAddPlaceFormErrors);
    setAddPlaceFormErrors(newAddPlaceFormErrors);
  };

  const createPlace = async (data) => {
    try {
      const res = await axios.post('http://localhost:3000/places', data, {
        headers: {
          Authorization: localStorage.getItem('jwt'),
        },
      });
      alert('Место успешно добавлено');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPlaceSaveClick = async () => {
    validateAllFieds();
    if (Object.values(addPlaceFormErrors).join('')) return;
    createPlace(addPlaceForm);
  };

  const onMarkerClustererClick = (markerClusterer) => {
    const clickedMarkers = markerClusterer.getMarkers();
    console.log(`Current clicked markers length: ${clickedMarkers.length}`);
    console.log(clickedMarkers);
  };

  const onPlacesChanged = () => {
    const places = refSearchBox.current.getPlaces();
    console.log('onPlacesChanged', places);
    // setSearchText(e.target.value);
    const bounds = new window.google.maps.LatLngBounds();

    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    const nextMarker = places[0]
      && places[0].geometry.location;
    const nextCenter = nextMarker && nextMarker.position ? nextMarker.position : center;
    setCenter(nextCenter);
    setSearchMarker(nextMarker);
    // refs.map.fitBounds(bounds);
  };

  const onBoundsChanged = () => {
    if (refMap) {
      setBounds(refMap.current.getBounds());
    }
  };

  const getAddressByCoordinates = async (lat, lng) => {
    try {
      const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`, {
      });
      const newAddress = res.data.results[0].formatted_address;
      refSearchInput.current.value = newAddress;
    } catch (err) {
      console.error(err);
    }
  };

  const isAddPlaceFormValid = !Object.values(addPlaceFormErrors).join('');
  return (
    <GoogleMap
      ref={refMap}
      onRightClick={(e) => {
        setSearchMarker({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
        getAddressByCoordinates(e.latLng.lat(), e.latLng.lng());
        toggleCreatePopUpOpen(true);
      }}
      defaultZoom={12}
      options={{
        minZoom: 8,
        maxZoom: 20,
        streetViewControl: true,
        scaleControl: true,
        mapTypeControl: true,
        panControl: true,
        zoomControl: true,
        rotateControl: true,
        fullscreenControl: false,
      }}
      center={center}
      onBoundsChanged={onBoundsChanged}
    >
      <SearchBox
        ref={refSearchBox}
        bounds={bounds}
        controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Поиск..."
          ref={refSearchInput}
          style={{
            marginTop: '10px',
            boxSizing: 'border-box',
            border: '1px solid transparent',
            width: 'calc(100% - 217px)',
            height: '40px',
            padding: '0 12px',
            borderRadius: '2px',
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px',
            fontSize: '18px',
            outline: 'none',
            textOverflow: 'ellipses',
            color: 'rgb(86, 86, 86)',
          }}
        />
      </SearchBox>
      {/* { searchMarker
      && (
      <MarkerWithLabel
        position={searchMarker}
        draggable
        onDragEnd={(e) => {
          setSearchMarker({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
        }}
        labelAnchor={new window.google.maps.Point(0, 0)}
        labelStyle={{ backgroundColor: 'yellow', fontSize: '32px', padding: '16px' }}
      >
        <div>Hello There!</div>
      </MarkerWithLabel>
      )} */}
      {searchMarker
      && (
        <>
          <Marker
            position={searchMarker}
            onClick={() => { toggleCreatePopUpOpen(!isCreatePopUpOpen); }}
            draggable
            icon={{
              url: placeIcon,
            }}
            onDragEnd={(e) => {
              setSearchMarker({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              });
              getAddressByCoordinates(e.latLng.lat(), e.latLng.lng());
            }}
          >
            {isCreatePopUpOpen && (
            <InfoWindow onCloseClick={() => { toggleCreatePopUpOpen(!isCreatePopUpOpen); }}>
              <Card>
                <CardHeader title="Добавление места" />
                <CardContent>
                  <form noValidate autoComplete="off">
                    <Grid container spacing={2} direction="column">
                      <Grid item>
                        <TextField
                          label="Адрес"
                          name="address"
                          value={addPlaceForm.address}
                          onChange={handleAddPlaceForm}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                          size="small"
                          error={!!addPlaceFormErrors.address}
                          helperText={addPlaceFormErrors.address}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          label="Описание"
                          name="description"
                          value={addPlaceForm.description}
                          onChange={handleAddPlaceForm}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                          size="small"
                          error={!!addPlaceFormErrors.description}
                          helperText={addPlaceFormErrors.description}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item>
                        <FormControl variant="outlined" margin="dense" fullWidth>
                          <InputLabel shrink>Файлы</InputLabel>
                          <OutlinedInput
                            type="file"
                            notched
                            labelWidth={50}
                            inputProps={{
                              accept: 'image/*',
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
                <CardActions style={{ paddingTop: 0 }}>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={!isAddPlaceFormValid}
                    onClick={handleAddPlaceSaveClick}
                  >
                    Сохранить
                  </Button>
                </CardActions>
              </Card>
            </InfoWindow>
            )}
          </Marker>
        </>
      )}
      <MarkerClusterer
        onClick={onMarkerClustererClick}
        averageCenter
        enableRetinaIcons
        gridSize={60}
        styles={[{
          textColor: 'white', height: 53, url: m1, width: 53,
        }, {
          textColor: 'white', height: 56, url: m2, width: 56,
        }, {
          textColor: 'white', height: 66, url: m3, width: 66,
        }, {
          textColor: 'white', height: 78, url: m4, width: 78,
        }, {
          textColor: 'white', height: 90, url: m5, width: 90,
        }]}
        minimumClusterSize={2}
      >
        {artObjects && artObjects.map(
          (artObject, key) => (
            <Marker
              key={key}
              position={{ lat: artObject.coordinates[1], lng: artObject.coordinates[0] }}
              onClick={() => {
                markerOnClick(artObject);
              }}
              icon={{
                url: artIcon,
              }}
              noRedraw
            />
          ))}
      </MarkerClusterer>
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
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
      />
    </div>
  );
}
