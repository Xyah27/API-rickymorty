import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

export interface Scan {
  id: string;
  code: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class QrScanService {
  private _storage: Storage | null = null;
  private _scans: Scan[] = [];
  public scans$ = new BehaviorSubject<Scan[]>([]);

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    this._storage = await this.storage.create();
    await this.loadScans();
  }

  private async loadScans() {
    const scans = await this._storage?.get('qr_scans');
    this._scans = scans || [];
    this.scans$.next(this._scans);
  }

  private getUserLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocalización no soportada'));
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  async scanAndSave(content: string): Promise<Scan> {
    const { latitude, longitude } = await this.getUserLocation();
    const scan: Scan = {
      id: Date.now().toString(),
      code: content,
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    };
    this._scans = [scan, ...this._scans];
    await this._storage?.set('qr_scans', this._scans);
    this.scans$.next(this._scans);
    return scan;
  }

  async removeScan(id: string) {
    this._scans = this._scans.filter(s => s.id !== id);
    await this._storage?.set('qr_scans', this._scans);
    this.scans$.next(this._scans);
  }
}
