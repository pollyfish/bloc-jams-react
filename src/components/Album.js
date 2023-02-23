import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });
    this.state= {  //initial state is created here
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      volume: 0,
      duration: album.songs[0].duration,
      isPlaying: false,
      isHovered: false,
      isPaused: true,


    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  componentDidMount() { //used when a component has been added to DOM. used w/ api calls and event handlers
    this.eventListeners = {
     timeupdate: e => { //tells it to display the current time
       this.setState({ currentTime: this.audioElement.currentTime });
     },
     durationchange: e => { // tells it to check for duration of song and show current time
       this.setState({ duration: this.formatTime(this.audioElement.duration) });
     },
     volumechange: e => {
       this.setState({ volume: this.audioElement.volume});
}


   };

   this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
   this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
   this.audioElement.addEventListener('volumechange',
   this.eventListeners.volumechange);
 }

 componentWillUnmount() { //Must unmount or else it will keep going even after scripts stop running
   this.audioElement.src = null;
   this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
   this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   this.audioElement.removeEventListener('volumechange',
   this.eventListeners.volumechange);
 }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song});
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }
  handlePrevClick(){
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
  }
  handleNextClick(){
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.min(4, currentIndex + 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value; //changes the duration to aspecified point "target value"
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }
  formatTime(timeInSeconds) {
          if (timeInSeconds < 10) {
              return (Math.floor(timeInSeconds / 60)) + ":0" + (Math.floor(timeInSeconds % 60))
          } else if (timeInSeconds) {
              return(Math.floor(timeInSeconds / 60 )) + ":" +(Math.floor(timeInSeconds % 60))
          } else {
              return "-:--";
          }
      }


  handleVolumeChange(e) {
  //  const newVolume= this.audioElement.volume * e.target.value;
    this.audioElement.volume = e.target.value;
    this.setState({ volume: 0.48 });
  }

  onHover(index) {
      this.setState({ isHovered: index });
  }

  offHover() {
      this.setState({ isHovered: false });
  }

  playPauseIcons(song, index) {
    if (this.state.isPlaying && this.state.isHovered === index && this.state.currentSong === song) {
      return <span className="icon ion-md-pause"></span>;
    } else if(this.state.isHovered === index) {
      return <span className="icon ion-md-play"></span>;
    } else if (this.state.isPlaying && this.state.currentSong === song) {
      return <span className="icon ion-md-pause"></span>;
    } else if (this.state.isPaused && this.state.currentSong === song) {
      return <span className="icon ion-md-play"></span>;
    } else {
      return <span className="song-number">{index + 1}</span>;
    }
  }

  render() {
    return (
      <section className="album">

         <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
      <section id="album-info">
        <div className="album-details">
        <h1 id="album-title">{this.state.album.title}</h1>
        <h2 className="artist">{this.state.album.artist}</h2>
        <div id="release-info">{this.state.album.releaseInfo}</div>
      </div>

          <table id="song-list">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>

           <tbody>
             {this.state.album.songs.map( (song, index) =>
           <tr className="song" key={index} onClick={() => this.handleSongClick(song)}
                 onMouseEnter={() => this.setState({isHovered: index })}
                 onMouseLeave={ () => this.setState({isHovered: false})}>
                                <td className="song-number">{this.playPauseIcons(song, index)}</td>
                                <td className="song-title">{song.title}</td>
                              <td className="song-duration">{this.formatTime(song.duration)}</td>
                              </tr> )
               }
         </tbody>
         </table>
         </section>
         <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.audioElement.currentTime}
           duration={this.audioElement.duration}
           volume={this.audioElement.volume}
          //length={this.audioElement.length}
           formatTime={(e) => this.formatTime(e)}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}


         />

  </section>
);
}
}

export default Album;
