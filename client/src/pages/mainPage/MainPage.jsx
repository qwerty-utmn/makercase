import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
import {
  InputBase,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Divider,
  IconButton,
  Drawer,
  Menu,
  MenuItem,
  Dialog,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import axios from 'axios';
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ArtMap from '../../components/artMap/ArtMap';
import ArtObjectCard from '../../components/ArtObjectCard/artObjectCard';
import ArtObjectCardSmall from '../../components/ArtObjectCardSmall/ArtObjectCardSmall';
import NewArtObjectDialog from '../../components/NewArtObjectDialog/NewArtObjectDialog';
import SignInDialog from '../../components/SignInDialog/SignInDialog';
import SignUpDialog from '../../components/SignUpDialog/SignUpDialog';
import ImageSlider from '../../components/ImageSlider/ImageSlider';

const drawerWidth = 360;
const imagesPath = 'http://localhost:3000/static-images/';

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
    justifyContent: 'space-between',
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
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'flex',
  },
}));

export default function MainPage() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openNewArtDialog, setOpenNewArtDialog] = useState(false);
  const [artObjects, setArtObjects] = useState([]);
  const [freePlaces, setFreePlaces] = useState([]);
  const [selectedArtObject, setSelectedArtObject] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogInDialog, setOpenLogInDialog] = useState(false);
  const [openSignUpDialog, setOpenSignUpDialog] = useState(false);
  const [user, setUser] = useState();
  const [loginEmail, setLoginEmail] = useState();
  const [openImagesCarousel, setOpenImagesCarousel] = useState(false);
  const [images, setImages] = useState([]);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const SignInClick = () => {
    handleMenuClose();
    setOpenLogInDialog(true);
  };

  const SignUpClick = () => {
    handleMenuClose();
    setOpenSignUpDialog(true);
  };

  const getArtObjects = async () => {
    const res = await axios.get('http://localhost:3000/artPlaces');
    setArtObjects(res.data);
  };

  const getPlaces = async () => {
    const res = await axios.get('http://localhost:3000/places');
    setFreePlaces(res.data);
  };

  useEffect(() => {
    getArtObjects();
    getPlaces();
    const user = localStorage.getItem('user');
    const jwt = localStorage.getItem('jwt');
    if (user && jwt) {
      setUser(user);
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setSelectedArtObject(null);
  };

  const handleNewArtObjectClick = () => {
    setOpenNewArtDialog(true);
  };

  const markerOnClick = async (artObject) => {
    setOpen(true);
    setSelectedArtObject(artObject);
  };

  const handleSignInDialogCloseClick = () => {
    setOpenLogInDialog(false);
  };

  const handleSignUpDialogCloseClick = () => {
    setOpenSignUpDialog(false);
  };

  const onUserSignIn = () => {
    const user = localStorage.getItem('user');
    setUser(user);
  };

  const onUserSignUp = () => {
    setOpenLogInDialog(true);
  };

  const onLogoutClick = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    setUser();
  };

  const onCardImageClick = () => {
    setOpenImagesCarousel(true);
    setImages(selectedArtObject.Images.map(img => ({ original: `${imagesPath}${img.path}` })));
    console.log(images);
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
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Поиск..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          {user
          && (
          <Typography variant="h6" noWrap>
            {user}
          </Typography>
          )}
          <div className={classes.sectionDesktop}>
            {!user && (
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            )}
            {user && (
            <IconButton
              edge="end"
              aria-label="logout"
              color="inherit"
              onClick={onLogoutClick}
            >
              <ExitToAppIcon />
            </IconButton>
            )}
          </div>
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
          {selectedArtObject
          && (
          <IconButton onClick={() => {
            setSelectedArtObject(null);
          }}
          >
            <ChevronLeftIcon />
          </IconButton>
          )}
          <div style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
          }}
          >
            <IconButton onClick={handleNewArtObjectClick}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <Divider />
        <div style={{
          overflowY: 'scroll',
        }}
        >
          {selectedArtObject ? (<ArtObjectCard artObject={selectedArtObject} onCardImageClick={onCardImageClick} />) : (
            artObjects.map((obj, index) => (
              <ArtObjectCardSmall
                key={index}
                artObject={obj}
                onClick={() => {
                  setSelectedArtObject(obj);
                }}
              />
            ))
          )}
        </div>
      </Drawer>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={SignInClick}>Авторизация</MenuItem>
        <MenuItem onClick={SignUpClick}>Регистрация</MenuItem>
      </Menu>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <ArtMap artObjects={artObjects} freePlaces={freePlaces} mapOptions={mapOptions} markerOnClick={markerOnClick} />
      </main>
      {openNewArtDialog && <NewArtObjectDialog />}
      {openLogInDialog
      && (
      <Dialog open>
        <SignInDialog
          onButtonCloseClick={handleSignInDialogCloseClick}
          onUserSignIn={onUserSignIn}
          loginEmail={loginEmail}
        />
      </Dialog>
      )}
      {openSignUpDialog
      && (
      <Dialog open>
        <SignUpDialog
          onButtonCloseClick={handleSignUpDialogCloseClick}
          onUserSignUp={onUserSignUp}
          setLoginEmail={setLoginEmail}
        />
      </Dialog>
      )}
      {openImagesCarousel
      && (
      <Dialog
        open
        onClose={() => {
          setOpenImagesCarousel(false);
        }}
      >
        <ImageSlider images={images} />
      </Dialog>
      )}
    </div>
  );
}
