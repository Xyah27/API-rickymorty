import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ImageService } from 'src/app/services/image.service';
import { SwiperComponent } from 'src/app/components/swiper/swiper.component';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Storage } from '@ionic/storage-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

declare var mapboxgl: any;

@Component({
  selector: 'app-tab1',
  standalone: true,
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    SwiperComponent
  ],
})
export class Tab1Page implements OnInit {
  images: { url: string; title: string; description: string }[] = [];
  photos: SafeResourceUrl[] = [];
  lat = 3.3439848;
  lng = -76.5416631;

  constructor(
    private imageService: ImageService,
    private storage: Storage,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    // Cargar carrusel
    this.images = this.imageService.getAllImages();

    // Inicializar Storage y cargar fotos guardadas
    await this.storage.create();
    const saved: string[] = (await this.storage.get('photos')) || [];
    this.photos = saved.map(path =>
      this.sanitizer.bypassSecurityTrustResourceUrl(path)
    );

    // Obtener ubicación y cargar mapa
    this.getUserLocation();
  }

  async takePicture() {
    try {
      const photo: Photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90
      });

      if (photo.webPath) {
        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(photo.webPath);
        this.photos.unshift(safeUrl);

        const stored: string[] = (await this.storage.get('photos')) || [];
        stored.unshift(photo.webPath);
        await this.storage.set('photos', stored);
      }
    } catch (err) {
      console.error('Error tomando foto', err);
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
          this.loadMap();
        },
        () => this.loadMap()
      );
    } else {
      this.loadMap();
    }
  }

  loadMap() {
    mapboxgl.accessToken = environment.mapboxToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6
    });

    map.on('load', () => {
      map.resize();
      new mapboxgl.Marker({ color: '#8BCF21' }).setLngLat([this.lng, this.lat]).addTo(map);

      // Permitimos undefined para labelLayerId, TS ya no se quejará
      let labelLayerId: string | undefined;

      const layers = map.getStyle().layers;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId // Puede ser undefined
      );
    });
  }
}
