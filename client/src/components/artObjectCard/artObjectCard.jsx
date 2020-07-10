import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  description: {
    whiteSpace: 'pre-wrap',
  },
});
const imagesPath = 'http://localhost:3000/static-images/';
export default function ArtObjectCardSmall({ artObject }) {
  const classes = useStyles();
  const { name, description, Images } = artObject;
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={'изображение'}
          height="200"
          image={`${imagesPath}${Images[0].path}`}
          // title={title}
        />
        <CardContent>
          <Typography color="textSecondary">
            название
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography color="textSecondary">
            описание
          </Typography>
          <Typography className={classes.description} variant="body2" color="textPrimary" component="p" dangerouslySetInnerHTML={{ __html: description }} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
