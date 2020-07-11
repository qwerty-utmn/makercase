import ImageGallery from 'react-image-gallery';
import React from 'react';

export default class ImageSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: props.images,
    };
  }

  render() {
    return (
      <ImageGallery
        showThumbnails={false}
        showPlayButton={false}
        items={this.state.images}
      />
    );
  }
}
