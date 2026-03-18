import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonItem, IonAvatar, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonAvatar,
    IonButton,      // <-- esto es lo importante
    IonIcon         // <-- para los íconos del corazón
  ],
})

export class Tab3Page implements OnInit {
  favoritos: any[] = [];

  constructor(private storageService: StorageService,  private router: Router) {}

  ngOnInit() {
    this.storageService.favoritos$.subscribe((data) => {
      this.favoritos = data;
    });
  }
  /**removeFavorito(personaje: any) {
    this.storageService.saveRemovePersonaje(personaje);
  }**/
  async toggleFavorite(personaje: any) {
    const wasFav = this.storageService.personajeInFavorites(personaje);

    // Añade/quita personaje y crea héroe en tu API si es nuevo
    await this.storageService.saveRemovePersonaje(personaje);

    // Si antes NO estaba y ahora SÍ (lo acabo de agregar):
    if (!wasFav) {
      // Ajusta la ruta si usas tabs, por ejemplo '/tabs/heroes'
      this.router.navigateByUrl('/heroes');
    }
  }
}
