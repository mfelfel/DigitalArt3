import React, { Component } from "react";
import "./App.css";

const keccak256 = require('keccak256');

class HashDigitalArt extends Component {

  //state = { Applied: 0, Published: 1, Cancelled: 2 };

  daHash; 

  render() {
    return (
      <div onSubmit={this.onFormSubmit}>
        <h1>test file</h1>
        <input type="file" name="file" onChange={(e)=>this.onDigitalArtUpload(e)} />
      </div>
    );
  }

  onDigitalArtUpload(e) {
    let datafile = e.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(datafile[0]);
    reader.onload = (e) => {
      this.daHash = keccak256(e.target.result).toString('hex'); 
    };
  }

}

export default HashDigitalArt;
