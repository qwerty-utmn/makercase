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
import ArtMap from '../../components/artMap/ArtMap';
import ArtObjectCard from '../../components/artObjectCard/artObjectCard';

// TODO потом убрать
const artObjectExample = {
  title: 'Инсомния',
  description: `"Инсомния" Дениса Живило

Эта работа — коллаб со временем суток. Днем на картине изображены спящие девушка и парень с переплетенными волосами, имитирующими вселенную сна. Ночью рисунок подсвечивается и изображение меняется: герои пробуждаются, и между ними возникает абстрактный огонь.`,
  image: 'https://doc-0k-a4-mymaps.googleusercontent.com/untrusted/hostedimage/gte5aua4ondjcemd37oocci88k/lao9vdicbjqfd03cs6qkstfu0o/1594116706000/JIhtsKx9eL3sPo-NNpmIg0IxLJSb746x/15525303149103609024/5AF2TALrdD9lbhpXt6cY4B9Jq-uYpjtTJauw3gO0UIDvM1Zqb4zaYD5u-DJdo6L_DZjCjZ6Ber0am4K93p-qoTdOCFNyQ0OstDx4-uw2kCFWJ5FTI3KO8-FhcYSUI2HI0y-suAqPfEbZQkHo4Ju4aLs-GItY9BS8C9by3TRTXXRWhIm7ExncPPbSS2-gV1qV-SxHfsO5_3MUToK6vDpxPa2nDFELqEzoHip6V2NZWMwqLFX5eFqPwGme575cTgE27BirMlf7v9NsbfZAyUzmaATgRrxYzCmWu7A?session=0&fife=s16383',
};

const mapOptions = {
  center: {
    lat: 57.142424,
    lng: 65.555071,
  },
  zoom: 12,
};

const drawerWidth = 360;

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
  const [artObjects, setArtObjects] = useState([]);
  const [selectedArtObject, setSelectedArtObject] = useState({});

  useEffect(() => {
    async function getArtObjects() {
      const res = await axios.get('http://localhost:3000/artPlaces');
      setArtObjects(res.data);
    }
    getArtObjects();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const markerOnClick = (artObject) => {
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
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <ArtObjectCard artObject={selectedArtObject} />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <ArtMap artObjects={artObjects} mapOptions={mapOptions} markerOnClick={markerOnClick} />
      </main>
    </div>
  );
}
