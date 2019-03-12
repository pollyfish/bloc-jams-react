import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';
class Library extends Component {
  constructor(props){
    super(props);
    this.state = { albums: albumData };
  }
  render () {
    return (
      <section className="library">
        {
          this.state.albums.map( (album, index) =>
            <Link to={`/album/${album.slug}`} key={index}>
            <img id="album-cover-lib" src={album.albumCover} alt={album.title} />
             <div className="recordinfo">{album.title}</div>
              <div className="recordinfo">{album.artist}</div>
            <div className="recordinfo">{album.songs.length} songs</div>
        </Link>
      )
        }
  </section>
);
  }
}

export default Library;
