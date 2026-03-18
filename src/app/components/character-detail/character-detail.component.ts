import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonIcon, IonItem, IonLabel, IonAvatar,
  IonList, IonChip, IonBadge
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonButton, IonContent, IonIcon, IonItem, IonLabel,
    IonAvatar, IonList, IonChip, IonBadge
  ]
})
export class CharacterDetailComponent {
  @Input() character: any;

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService
  ) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  toggleFavorito() {
    this.storageService.saveRemovePersonaje(this.character);
  }

  esFavorito(): boolean {
    return this.storageService.personajeInFavorites(this.character);
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'alive': return '#55cc44';
      case 'dead': return '#d63d2e';
      default: return '#999999';
    }
  }
}
