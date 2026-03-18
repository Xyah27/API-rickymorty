import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonButton, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonList, IonItem, IonLabel, IonIcon,
  IonInput
} from '@ionic/angular/standalone';
import { QrScanService, Scan } from '../../services/qr-scan.service';
import { NgIf, NgForOf, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import jsQR from 'jsqr';
import { environment } from 'src/environments/environment';

declare var mapboxgl: any;

@Component({
  selector: 'app-tab5',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonButton, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonList, IonItem, IonLabel, IonIcon,
    IonInput, NgIf, NgForOf, DatePipe, DecimalPipe, FormsModule
  ],
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit, OnDestroy {
  scanning = false;
  manualCode = '';
  scans: Scan[] = [];
  selectedScan: Scan | null = null;
  scanMessage = '';
  private sub!: Subscription;
  private map: any = null;
  private videoStream: MediaStream | null = null;
  private scanInterval: any = null;
  private lastScannedCode = '';
  private cooldownUntil = 0;

  constructor(private qrSvc: QrScanService) {}

  ngOnInit() {
    this.sub = this.qrSvc.scans$.subscribe(list => {
      this.scans = list;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.stopScan();
  }

  async startScan() {
    this.scanning = true;
    this.scanMessage = '';
    this.lastScannedCode = '';
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setTimeout(() => {
        const video = document.getElementById('qr-video') as HTMLVideoElement;
        if (video && this.videoStream) {
          video.srcObject = this.videoStream;
          video.play();
          this.startQrDecoding(video);
        }
      }, 200);
    } catch (err) {
      console.error('No se pudo acceder a la cámara:', err);
      this.scanning = false;
    }
  }

  private startQrDecoding(video: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    this.scanInterval = setInterval(() => {
      if (!this.scanning || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (qrCode && qrCode.data) {
        const now = Date.now();
        // Skip if same code scanned within 3 seconds (cooldown)
        if (qrCode.data === this.lastScannedCode && now < this.cooldownUntil) return;
        this.lastScannedCode = qrCode.data;
        this.cooldownUntil = now + 3000;
        this.onQrDetected(qrCode.data);
      }
    }, 250);
  }

  private async onQrDetected(code: string) {
    this.scanMessage = `✓ Guardado: ${code}`;
    try {
      await this.qrSvc.scanAndSave(code);
    } catch (err) {
      console.error('Error guardando scan:', err);
    }
  }

  stopScan() {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(t => t.stop());
      this.videoStream = null;
    }
    this.scanning = false;
  }

  async saveManualScan() {
    const code = this.manualCode.trim();
    if (!code) return;
    try {
      const saved = await this.qrSvc.scanAndSave(code);
      this.manualCode = '';
      this.showOnMap(saved);
    } catch (err) {
      console.error('Error guardando scan:', err);
    }
  }

  showOnMap(scan: Scan) {
    this.selectedScan = scan;
    setTimeout(() => this.renderMap(scan.latitude, scan.longitude, scan.code), 150);
  }

  async removeScan(scan: Scan) {
    await this.qrSvc.removeScan(scan.id);
    if (this.selectedScan?.id === scan.id) {
      this.selectedScan = null;
      this.map = null;
    }
  }

  isUrl(code: string): boolean {
    return code?.startsWith('http://') || code?.startsWith('https://');
  }

  private renderMap(lat: number, lng: number, label: string) {
    const container = document.getElementById('scan-map');
    if (!container) return;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    mapboxgl.accessToken = environment.mapboxToken;

    this.map = new mapboxgl.Map({
      container: 'scan-map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: 15
    });

    this.map.on('load', () => {
      this.map.resize();
      new mapboxgl.Marker({ color: '#8BCF21' })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setText(label))
        .addTo(this.map)
        .togglePopup();
    });
  }
}
