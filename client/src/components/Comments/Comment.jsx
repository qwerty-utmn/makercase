import React, { Component } from 'react';
import moment from 'moment';
import {
  Avatar,
  Typography,
  Grid,
} from '@material-ui/core';

const styles = {
  bubble: {
    padding: '8px',
    background: '#F4F6F8',
    borderRadius: '10px',
  },
};

class Comment extends Component {
  render() {
    const { comment } = this.props;
    return (
      <>
        {comment && comment.user && comment.user.name && (
        <Grid container direction="row" alignItems="center" style={{ marginBottom: '16px' }}>
          <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              alt={`${comment.user.name}`}
            >
              {comment.user.name}
            </Avatar>
          </Grid>
          <Grid item style={{ marginLeft: '8px', flexGrow: 1 }}>
            <Grid container direction="column" style={{ ...styles.bubble }}>
              <Grid item style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  {`${comment.user.name}`}
                </Typography>
                <Typography
                  variant="body2"
                >
                  {moment(comment.createdAt).format('DD.MM.YYYY')}
                </Typography>
              </Grid>
              <Grid item style={{ marginTop: '8px' }}>
                <Typography
                  variant="body1"
                >
                  {comment.text}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        )}
      </>
    );
  }
}
export default Comment;
