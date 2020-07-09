import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import axios from 'axios';
import AddIcon from '@material-ui/icons/Add';
import ArtMap from '../../components/artMap/ArtMap';
import ArtObjectCard from '../../components/ArtObjectCard/ArtObjectCard';
import ArtObjectCardSmall from '../../components/ArtObjectCardSmall/ArtObjectCardSmall';
import NewArtObjectDialog from '../../components/newArtObjectDialog/NewArtObjectDialog';

const drawerWidth = 360;

const mapOptions = {
  center: {
    lat: 57.142424,
    lng: 65.555071,
  },
  zoom: 12,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function MainPage() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openNewArtDialog, setOpenNewArtDialog] = useState(false);
  const [artObjects, setArtObjects] = useState([]);
  const [selectedArtObject, setSelectedArtObject] = useState();

  useEffect(() => {
    async function getArtObjects() {
      const res = await axios.get('http://localhost:3000/artPlaces');
      setArtObjects(res.data);
    }
    getArtObjects();
  }, []);

  useEffect(() => { console.log(selectedArtObject); }, [selectedArtObject]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNewArtObjectClick = () => {
    setOpenNewArtDialog(true);
  };

  const markerOnClick = async (artObject) => {
    setOpen(true);
    setSelectedArtObject(artObject);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Карта арт-объектов Тюмени
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleNewArtObjectClick}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <div style={{
          overflowX: 'scroll',
        }}
        >
          {selectedArtObject ? (<ArtObjectCard artObject={selectedArtObject} />) : (
            artObjects.map((obj, index) => (
              <ArtObjectCardSmall
                key={index}
                artObject={obj}
                onClick={() => {
                  console.log('click');
                  setSelectedArtObject(obj);
                }}
              />
            ))
          )}
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <ArtMap artObjects={artObjects} mapOptions={mapOptions} markerOnClick={markerOnClick} />
      </main>
      {openNewArtDialog && <NewArtObjectDialog />}
    </div>
  );
}
