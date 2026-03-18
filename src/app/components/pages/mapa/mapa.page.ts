import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class MapaPage implements OnInit, AfterViewInit {

  lat: number = 3.3439848;
  lng: number = -76.5416631;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Puedes descomentar esto si recibes coordenadas por parámetros
    // let geo: any = this.route.snapshot.paramMap.get('geo');
    // geo = geo.substr(4).split(',');
    // this.lat = Number(geo[0]);
    // this.lng = Number(geo[1]);
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = environment.mapboxToken;

    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v9',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map'
    });

    map.on('load', () => {
      map.resize();

      new mapboxgl.Marker().setLngLat([this.lng, this.lat]).addTo(map);

      const layers = map.getStyle().layers;
      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            15.05, ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            15.05, ['get', 'min_height']
          ],
          'fill-extrusion-opacity': .6
        }
      }, labelLayerId);
    });
  }
}

