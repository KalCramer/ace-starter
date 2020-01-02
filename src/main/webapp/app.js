import React, { Component } from 'react'
import Contacts from './components/missions';
import axios from 'axios'
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {OSM, Vector as VectorSource} from 'ol/source';
import {fromLonLat} from 'ol/proj';

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

    var raster = new TileLayer({
    source: new XYZ({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              })
    });

    // create feature layer and vector source
    var vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: []
      })
    });

    // create map object with feature layer
     new Map({
      target: 'map',
      layers: [raster, vectorLayer],
      view: new View({
        center: [0, 0],
        zoom: 2
      })

    });
        this.setState({
          map: map,
          vectorLayer: vectorLayer
        });

    }

 addFeature(route){
        console.log("add", route)
         var feature = new Feature({
               geometry: new Point(fromLonLat([route['longitude'], route['latitude']])),
               name: 'Null Island',
               population: 4000,
               rainfall: 500
         });
             this.state.vectorLayer.getSource().addFeature(feature)
             /*this.state.vectorLayer.setSource(new VectorSource({
                                                      features: [feature]
                                                    }));*/
 }

  // pass new features from props into the OpenLayers layer object
  componentDidUpdate(prevProps, prevState) {
    var routes = this.props.routes
    if(routes != undefined) {
        routes.map(this.addFeature, {state: this.state});
    }
  }

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



  tick() {
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

          componentDidMount() {
            this.interval = setInterval(() => this.tick(), 2000);
          }

          componentWillUnmount() {
            clearInterval(this.interval);
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