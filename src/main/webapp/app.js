import React, { Component } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { OSM, Vector as VectorSource } from 'ol/source'
import { fromLonLat } from 'ol/proj'
import RouteTable from './components/missions'

import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'

import Style from 'ol/style/Style'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

class MapWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    var raster = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      }),
    })

    // create feature layer and vector source
    var vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [],
      }),
    })

    // create map object with feature layer
    new Map({
      target: 'map',
      layers: [raster, vectorLayer],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    })
    this.setState({
      map: map,
      vectorLayer: vectorLayer,
      colorMap: {},
    })
  }

  addFeature(route) {
    console.log('add', route)
    var feature = new Feature({
      geometry: new Point(fromLonLat([route['longitude'], route['latitude']])),
    })
    feature.setId(route['missionId'])

    var style = this.state.colorMap[route['missionId']]
    if (style == undefined) {
      var num = Math.round(0xffffff * Math.random())
      var r = num >> 16
      var g = (num >> 8) & 255
      var b = num & 255
      var color = 'rgb(' + r + ', ' + g + ', ' + b + ')'
      var style = new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: color }),
          stroke: new Stroke({
            color: 'black',
            width: 2,
          }),
        }),
      })
      this.state.colorMap[route['missionId']] = style
    } else {
      var style = this.state.colorMap[route['missionId']]
      var color = style
        .getImage()
        .getFill()
        .getColor()
    }

    feature.setStyle(style)
    var oldPoint = this.state.vectorLayer
      .getSource()
      .getFeatureById(route['missionId'])
    if (oldPoint != undefined) {
      this.state.vectorLayer.getSource().removeFeature(oldPoint)
    }
    this.state.vectorLayer.getSource().addFeature(feature)

    //add line

    var line = this.state.vectorLayer
      .getSource()
      .getFeatureById(route['missionId'] + '-line')
    if (line == undefined) {
      var line = new Feature({
        geometry: new LineString([
          fromLonLat([route['longitude'], route['latitude']]),
        ]),
      })
      line.setId(route['missionId'] + '-line')

      var lineStyle = new Style({
        stroke: new Stroke({
          color: color,
          width: 2,
        }),
      })
      line.setStyle(lineStyle)

      this.state.vectorLayer.getSource().addFeature(line)
    } else {
      var geo = line.getGeometry()
      geo.appendCoordinate(fromLonLat([route['longitude'], route['latitude']]))
    }
  }

  // pass new features from props into the OpenLayers layer object
  componentDidUpdate(prevProps, prevState) {
    var routes = this.props.routes
    if (routes != undefined) {
      routes.map(this.addFeature, { state: this.state })
    }
  }

  render() {
    return <div id="map"> </div>
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      routes: [],
    }
  }

  tick() {
    fetch('/services/healthstatus/pulse/v1/status/sensor/geo', {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-cache',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: 'Basic ' + 'YWRtaW46YWRtaW4=',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({ routes: data })
      })
      .catch(console.log)
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 500)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div>
            <div style={{height: "60%"}}>

        <MapWrapper routes={this.state.routes} />
              </div>
            <div style={{height: "35%"}}>

        <RouteTable routes={this.state.routes}  />
              </div>

      </div>
    )
  }
}

export { App, MapWrapper }
