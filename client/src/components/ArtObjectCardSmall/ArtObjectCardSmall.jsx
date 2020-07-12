import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  description: {
    whiteSpace: 'pre-wrap',
  },
});
const imagesPath = 'http://164.90.187.182:3000/static-images/';
export default function ArtObjectCardSmall({ artObject, onClick }) {
  const classes = useStyles();
  const { name, description, Images } = artObject;
  return (
    <Card className={classes.root} onClick={onClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={'изображение'}
          height="140"
          image={`${imagesPath}${Images[0].path}`}
          // title={title}
        />
      </CardActionArea>
    </Card>
  );
}
