import React, { useState } from 'react';
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

function Map({ artObjects, markerOnClick }) {
  const [createdObject, setCreatedObject] = useState();
  const [isCreatePopUpOpen, toggleCreatePopUpOpen] = useState(false);
  const [addPlaceForm, setAddPlaceForm] = useState({ address: '', description: '', images: [] });
  const [addPlaceFormErrors, setAddPlaceFormErrors] = useState({ address: '', description: '' });

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

  const isAddPlaceFormValid = !Object.values(addPlaceFormErrors).join('');
  return (
    <GoogleMap
      onRightClick={(e) => {
        setCreatedObject({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          show: true,
        });
        toggleCreatePopUpOpen(true);
      }}
      defaultZoom={12}
      defaultCenter={{ lat: 57.142424, lng: 65.555071 }}
    >
      {(createdObject && createdObject.show)
      && (
        <>
          <Marker
            position={{ lat: createdObject.lat, lng: createdObject.lng }}
            onClick={() => { toggleCreatePopUpOpen(!isCreatePopUpOpen); }}
            draggable
            onDragEnd={(e) => {
              setCreatedObject({
                ...createdObject,
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              });
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
      {artObjects && artObjects.map(
        (artObject, key) => (
          <Marker
            key={key}
            position={{ lat: artObject.coordinates[1], lng: artObject.coordinates[0] }}
            onClick={() => {
              markerOnClick(artObject);
            }}
            noRedraw
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
