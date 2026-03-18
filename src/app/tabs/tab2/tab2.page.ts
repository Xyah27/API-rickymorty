import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonItem,
  IonLabel, IonAvatar, IonButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';

import { RickyMortyService } from 'src/app/services/ricky-morty.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonItem,
    IonLabel, IonAvatar, IonButton, IonIcon,
    IonInfiniteScroll, IonInfiniteScrollContent
  ],
})
export class Tab2Page {
  personajes: any[] = [];
  page = 1;
  loading = false;
  allLoaded = false;
  private favIds = new Set<number>();
  private loadTimeout: any;

  constructor(
    private api: RickyMortyService,
    private storageService: StorageService
  ) {}

  ionViewWillEnter() {
    this.loadMore();
    this.storageService.favoritos$.subscribe((favs) => {
      this.favIds = new Set(favs.map((p: any) => p.id));
    });
  }

  loadMore(event?: any) {
    if (this.loading) return;

    this.loading = true;
    this.loadTimeout = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.allLoaded = true;
        event?.target.complete();
      }
    }, 10000);

    this.api.getCharactersPaginated(this.page).subscribe((data) => {
      clearTimeout(this.loadTimeout);
      this.personajes = [...this.personajes, ...data.results];
      this.page++;
      this.loading = false;
      event?.target.complete();

      if (!data.info.next) {
        this.allLoaded = true;
      }
    });
  }

  toggleFavorito(personaje: any) {
    this.storageService.saveRemovePersonaje(personaje);
  }
  esFavorito(personaje: any): boolean {
    return this.favIds.has(personaje.id);
  }
}
