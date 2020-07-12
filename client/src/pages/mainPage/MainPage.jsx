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
  Button,
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
import ArtObjectCard from '../../components/artObjectCard/artObjectCard';
import ArtObjectCardSmall from '../../components/ArtObjectCardSmall/ArtObjectCardSmall';
import SignInDialog from '../../components/SignInDialog/SignInDialog';
import SignUpDialog from '../../components/SignUpDialog/SignUpDialog';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import CommentsBox from '../../components/Comments/CommentsBox';

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
  filters: {
    position: 'relative',
    '& > button': {
      margin: theme.spacing(1),
      color: 'white',
      backgroundColor: 'transparent',
      '&.active': {
        backgroundColor: fade(theme.palette.common.white, 0.15),
      },
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
    },
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
  const [selectedMapLayer, setSelectedMapLayer] = useState('art');
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

  const handleSelectArtObject = async (artObject) => {
    try {
      // const res = await axios.get(`http://localhost:3000/places/${artObject.id}`, {
      //   headers: {
      //     Authorization: localStorage.getItem('jwt'),
      //   },
      // });
      setSelectedArtObject({ ...artObject, comments: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const markerOnClick = (artObject) => {
    setOpen(true);
    handleSelectArtObject(artObject);
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

  const handleMessageSend = async (text) => {
    try {
      const res = await axios.post(`http://localhost:3000/${selectedArtObject.id}/comment`, { text }, {
        headers: {
          Authorization: localStorage.getItem('jwt'),
        },
      });
      // window.location.reload(false);
    } catch (err) {
      console.error(err);
    }
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
          <div className={classes.filters}>
            <Button className={selectedMapLayer === 'art' ? 'active' : ''} onClick={() => setSelectedMapLayer('art')}>Арт объекты</Button>
            <Button className={selectedMapLayer === 'place' ? 'active' : ''} onClick={() => setSelectedMapLayer('place')}>Места</Button>
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
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <Divider />
        {selectedArtObject ? (
          <div>
            <ArtObjectCard artObject={selectedArtObject} onCardImageClick={onCardImageClick} />
            <CommentsBox
              comments={selectedArtObject.comments}
              currentUser={user}
              handleMessageSend={handleMessageSend}
            />
          </div>
        ) : (
          <div style={{
            overflowY: 'scroll',
          }}
          >
            {artObjects.map((obj, index) => (
              <ArtObjectCardSmall
                key={index}
                artObject={obj}
                onClick={() => {
                  handleSelectArtObject(obj);
                }}
              />
            ))}
          </div>
        )}
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
        <ArtMap
          artObjects={artObjects}
          freePlaces={freePlaces}
          mapOptions={mapOptions}
          markerOnClick={markerOnClick}
          selectedMapLayer={selectedMapLayer}
        />
      </main>
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
