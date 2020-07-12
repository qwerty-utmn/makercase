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
  Typography,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const { MarkerClusterer } = require('react-google-maps/lib/components/addons/MarkerClusterer');
// const { MarkerWithLabel } = require('react-google-maps/lib/components/addons/MarkerWithLabel');
const { SearchBox } = require('react-google-maps/lib/components/places/SearchBox');
const placeIcon = require('../../images/wall.svg');
const artIcon = require('../../images/art.svg');
const m1 = require('../../images/m1.png');
const m2 = require('../../images/m2.png');
const m3 = require('../../images/m3.png');
const m4 = require('../../images/m4.png');
const m5 = require('../../images/m5.png');

const API_KEY = 'AIzaSyCJTm8QajP4RjJCtFmYeReQDfuKJXIPiO0';

function Map({
  artObjects, freePlaces, markerOnClick, selectedMapLayer, ...props
}) {
  const [isCreatePopUpOpen, setCreatePopUpOpen] = useState(false);
  const [addPlaceForm, setAddPlaceForm] = useState({
    address: null, description: '', name: '', images: [],
  });
  const [addPlaceFormSuggestedPlaces, setAddPlaceFormSuggestedPlaces] = useState([]);
  const [addPlaceFormSearchQuery, setAddPlaceFormSearchQuery] = useState('');
  const [addPlaceFormErrors, setAddPlaceFormErrors] = useState({ address: '', description: '' });
  const [bounds, setBounds] = useState(null);
  const [center, setCenter] = useState({ lat: 57.142424, lng: 65.555071 });
  const [searchMarker, setSearchMarker] = useState(null);

  const refSearchBox = useRef(null);
  const refSearchInput = useRef(null);
  const refMap = useRef(null);

  const getAddressByText = async (text) => {
    const displaySuggestions = function (predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
      }
      console.log('predictions', predictions);
      setAddPlaceFormSuggestedPlaces(predictions);
    };

    const service = new window.google.maps.places.AutocompleteService();
    service.getQueryPredictions({ input: text, types: ['geocode'] }, displaySuggestions);
  };

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
      const formData = new FormData();
      console.log('data', data);
      for (const image of data.images) {
        formData.append('images', image);
      }
      for (const coord of data.coordinates) {
        formData.append('coordinates', +coord);
      }
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('address', data.address);
      const res = await axios.post('http://localhost:3000/places', formData, {
        headers: {
          'Content-type': 'multipart/form-data; charset=UTF-8',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      alert('Место успешно добавлено');
      window.location.reload(false);
    } catch (err) {
      console.error(err);
    }
  };

  const createArt = async (data) => {
    try {
      const formData = new FormData();
      console.log('data', data);
      for (const image of data.images) {
        formData.append('images', image);
      }
      for (const coord of data.coordinates) {
        formData.append('coordinates', +coord);
      }
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('address', data.address);
      const res = await axios.post('http://localhost:3000/artPlaces', formData, {
        headers: {
          'Content-type': 'multipart/form-data; charset=UTF-8',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      alert('Стрит-арт успешно добавлен');
      window.location.reload(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPlaceSaveClick = async () => {
    validateAllFieds();
    if (Object.values(addPlaceFormErrors).join('')) return;
    if (!localStorage.getItem('jwt')) {
      alert('Вам необходимо зарегистрировать');
      return;
    }
    if (selectedMapLayer === 'art') {
      createArt(addPlaceForm);
    } else {
      createPlace(addPlaceForm);
    }
  };

  const onPlacesChanged = () => {
    const places = refSearchBox.current.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();

    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    console.log('places[0]', places[0]);
    const nextMarker = places[0]
      && places[0].geometry.location;
    const nextCenter = nextMarker && nextMarker.position ? nextMarker.position : center;
    setCenter(nextCenter);
    setSearchMarker(nextMarker);
    setCreatePopUpOpen(true);
    const newAddress = places[0]
    && places[0].formatted_address;
    setAddPlaceForm({ ...addPlaceForm, address: newAddress, coordinates: [nextMarker.lat(), nextMarker.lng()] });
    setAddPlaceFormSearchQuery(newAddress);
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
      setAddPlaceForm({ ...addPlaceForm, address: newAddress, coordinates: [lat, lng] });
      setAddPlaceFormSearchQuery(newAddress);
    } catch (err) {
      console.error(err);
    }
  };

  const getPlaceDetails = async (placeId) => {
    // try {
    //   const res = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${API_KEY}`, {
    //   });
    //   console.log(res);
    // } catch (err) {
    //   console.error(err);
    // }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === 'OK') {
        const newAddress = results[0].formatted_address;
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        setAddPlaceForm({ ...addPlaceForm, address: newAddress, coordinates: [lat, lng] });
      }
    });
  };

  const handleSelectedAddPlaceFormAddress = (e, value) => {
    e.persist();
    console.log('handleSelectedAddPlaceFormAddress', e.target, value);
    setAddPlaceFormSearchQuery(value.description);
    getPlaceDetails(value.place_id);
  };

  const handleImagesChange = (e) => {
    setAddPlaceForm({ ...addPlaceForm, images: e.target.files });
  };

  console.log('freePlaces', freePlaces);
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
        setCreatePopUpOpen(true);
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
            onClick={() => { setCreatePopUpOpen(!isCreatePopUpOpen); }}
            draggable
            icon={{
              url: selectedMapLayer === 'art' ? artIcon : placeIcon,
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
            <InfoWindow onCloseClick={() => { setCreatePopUpOpen(!isCreatePopUpOpen); }}>
              <Card>
                <CardHeader title="Добавление места" />
                <CardContent>
                  <form noValidate autoComplete="off">
                    <Grid container spacing={2} direction="column">
                      <Grid item>
                        <Autocomplete
                          freeSolo
                          disableClearable
                          options={addPlaceFormSuggestedPlaces}
                          getOptionLabel={(a) => a.description || ''}
                          getOptionSelected={(option, value) => value.id === option.id}
                          renderOption={(option) => <Typography noWrap>{option.description}</Typography>}
                          onChange={(e, value) => {
                            handleSelectedAddPlaceFormAddress(e, value);
                          }}
                          filterOptions={(options) => options}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Адрес"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                              margin="dense"
                              InputProps={{ ...params.InputProps, type: 'search' }}
                              value={addPlaceFormSearchQuery}
                              onChange={(e) => {
                                e.persist();
                                setAddPlaceFormSearchQuery(e.target.value);
                                getAddressByText(e.target.value);
                              }}
                            />
                          )}
                          value={addPlaceForm.address}
                          inputValue={addPlaceFormSearchQuery}
                        />
                        {/* <TextField
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
                        /> */}
                      </Grid>
                      {selectedMapLayer === 'art'
                      && (
                      <Grid item>
                        <TextField
                          label="Название"
                          name="name"
                          value={addPlaceForm.name}
                          onChange={handleAddPlaceForm}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                          size="small"
                          error={!!addPlaceFormErrors.name}
                          helperText={addPlaceFormErrors.name}
                          fullWidth
                          required
                        />
                      </Grid>
                      )}
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
                              multiple: true,
                            }}
                            onChange={handleImagesChange}
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
      {selectedMapLayer === 'art'
        ? (
          <MarkerClusterer
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
                  position={{ lat: artObject.coordinates[0], lng: artObject.coordinates[1] }}
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
        )
        : (
          <MarkerClusterer
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
            {freePlaces && freePlaces.map(
              (freePlace, key) => {
                console.log('freePlacefreePlace', freePlace);
                return (
                  <Marker
                    key={key}
                    position={{ lat: freePlace.coordinates[0], lng: freePlace.coordinates[1] }}
              // onClick={() => {
              //   markerOnClick(freePlace);
              // }}
                    icon={{
                      url: placeIcon,
                    }}
                    noRedraw
                  />
                );
              })}
          </MarkerClusterer>
        )}
    </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function ArtMap({
  artObjects, freePlaces, markerOnClick, selectedMapLayer,
}) {
  return (
    <div style={{ height: '93%' }}>
      <WrappedMap
        artObjects={artObjects}
        freePlaces={freePlaces}
        markerOnClick={markerOnClick}
        selectedMapLayer={selectedMapLayer}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
      />
    </div>
  );
}
