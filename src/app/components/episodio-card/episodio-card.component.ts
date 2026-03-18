import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonIcon, IonItem, IonAvatar, IonLabel,
  IonSpinner, IonBadge, IonList
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { RickyMortyService } from 'src/app/services/ricky-morty.service';
import { CharacterDetailComponent } from '../character-detail/character-detail.component';

@Component({
  selector: 'app-episodio-card',
  standalone: true,
  templateUrl: './episodio-card.component.html',
  styleUrls: ['./episodio-card.component.scss'],
  imports: [
    CommonModule, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonIcon, IonItem,
    IonAvatar, IonLabel, IonSpinner, IonBadge, IonList
  ]
})
export class EpisodioCardComponent {
  @Input() episodio: any;

  expanded = false;
  characters: any[] = [];
  loadingChars = false;
  charsLoaded = false;

  constructor(
    private api: RickyMortyService,
    private modalCtrl: ModalController
  ) {}

  toggle() {
    this.expanded = !this.expanded;
    if (this.expanded && !this.charsLoaded) {
      this.loadCharacters();
    }
  }

  private loadCharacters() {
    const ids = this.episodio.characters.map((url: string) => {
      const parts = url.split('/');
      return Number(parts[parts.length - 1]);
    });
    this.loadingChars = true;
    this.api.getCharactersByIds(ids).subscribe(data => {
      this.characters = Array.isArray(data) ? data : [data];
      this.loadingChars = false;
      this.charsLoaded = true;
    });
  }

  async openCharacterDetail(character: any) {
    const modal = await this.modalCtrl.create({
      component: CharacterDetailComponent,
      componentProps: { character }
    });
    await modal.present();
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'alive': return '#55cc44';
      case 'dead': return '#d63d2e';
      default: return '#999999';
    }
  }
}
