import React, { Component } from 'react'
import Contacts from './components/missions';
import axios from 'axios'
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import LayerVector from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';

import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';

class MapWrapper extends Component {
    constructor(props){
    super(props)
    console.log(props)
        this.state = {}
    }

  componentDidMount() {

    // create feature layer and vector source
    var featuresLayer = new LayerVector({
      source: new SourceVector({
        features:[]
      })
    });

    // create map object with feature layer
     new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
        this.setState({
          map: map,
          featuresLayer: featuresLayer
        });

}
/*
    map.on('click', this.handleMapClick.bind(this));
*/

    // save map and layer references to local state

  //}


  // pass new features from props into the OpenLayers layer object
  componentDidUpdate(prevProps, prevState) {
    console.log(this.props.routes)
    var feature = new Feature({
      geometry: new Point([0, 0]),
      color: 'red',
      labelPoint: new Point([0,0]),
      name: 'My Polygon'
    });
    this.state.featuresLayer.setSource(
      new SourceVector({
        features: [feature]//this.props.routes
      })
    );
  }


/*  handleMapClick(event) {

   *//* // create WKT writer
    var wktWriter = new ol.format.WKT();

    // derive map coordinate (references map from Wrapper Component state)
    var clickedCoordinate = this.state.map.getCoordinateFromPixel(event.pixel);

    // create Point geometry from clicked coordinate
    var clickedPointGeom = new ol.geom.Point( clickedCoordinate );

    // write Point geometry to WKT with wktWriter
    var clickedPointWkt = wktWriter.writeGeometry( clickedPointGeom );

    // place Flux Action call to notify Store map coordinate was clicked
    Actions.setRoutingCoord( clickedPointWkt );*//*

  }*/

  render () {
    return (
      <div id="map"> </div>
    );
  }
}

class App extends Component {
    constructor(props){
    super(props)
    this.state = {
        contacts: []
    };
    }

    componentDidMount() {

    fetch('/services/healthstatus/pulse/v1/status/sensor/geo',
        {method:'GET', credentials: 'same-origin', cache: 'no-cache',
         headers: {
         'X-Requested-With': 'XMLHttpRequest',
         'Authorization': 'Basic ' + "YWRtaW46YWRtaW4="
},
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                this.setState({ contacts: data })
            })
            .catch(console.log)
    }

/*
                <Contacts contacts={this.state.contacts} map={this.props.map} />
*/
        render() {
            return (
            <div>
                <MapWrapper routes={this.state.contacts}  />
            </div>
            )
        }
}

export {
  App,
  MapWrapper,
}