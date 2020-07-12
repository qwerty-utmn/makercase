import React, { Component } from 'react';
import {
  Avatar,
  Divider,
  IconButton,
  Input,
  Paper,
  Tooltip,
  Grid,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      multiline: false,
    };
  }

  handleMessageChange = (e) => {
    this.setState({ text: e.target.value });
  };

  render() {
    const {
      handleMessageSend,
      currentUser,
    } = this.props;
    const { multiline, text } = this.state;
    return (
      <Grid container alignItems="center" style={{ marginTop: '16px', paddingRight: '8px' }}>
        <Grid item>
          <Avatar
            alt={`${currentUser.name || ''}`}
          >
            {currentUser.name || ''}
          </Avatar>
        </Grid>
        <Grid item style={{ flexGrow: 1, marginLeft: '8px' }}>
          <Paper
            elevation={1}
            style={{ paddingLeft: '8px' }}
          >
            <Input
              disableUnderline
              onChange={this.handleMessageChange}
              placeholder="Оставить комментарий"
              multiline={multiline}
              onFocus={() => {
                this.setState({ multiline: true });
              }}
              onBlur={() => {
                this.setState({ multiline: false });
              }}
              value={this.state.text}
              fullWidth
            />
          </Paper>
        </Grid>
        <Tooltip title="Отправить">
          <IconButton
            color={text.length > 0 ? 'primary' : 'default'}
            onClick={() => handleMessageSend(text)}
          >
            <SendIcon />
          </IconButton>
        </Tooltip>
        <Divider style={{ width: 1, height: 24 }} />
      </Grid>
    );
  }
}

export default CommentForm;
