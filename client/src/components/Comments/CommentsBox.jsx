import React, { Component } from 'react';
import {
  CardContent,
  Card,
  CardHeader,
  Divider,
} from '@material-ui/core';
import CommentForm from './CommentForm';
import Comment from './Comment';

class CommentsBox extends Component {
  render() {
    const {
      style,
      currentUser,
      handleMessageSend,
      comments,
    } = this.props;
    return (
      <Card
        style={{ ...style }}
        elevation={0}
      >
        <CardHeader
          style={{ paddingBottom: 0 }}
          title="Комментарии"
        />
        <CardContent style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          {comments && (
            <>
              {comments.map((comment) => (
                <Comment
                  comment={comment}
                  key={comment.id}
                />
              ))}
            </>
          )}
          <Divider />
          <CommentForm
            currentUser={currentUser}
            handleMessageSend={handleMessageSend}
          />
        </CardContent>
      </Card>
    );
  }
}

export default CommentsBox;
