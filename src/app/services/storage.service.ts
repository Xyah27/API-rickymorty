import { Injectable }                       from '@angular/core';
import { Storage }                          from '@ionic/storage-angular';
import { BehaviorSubject }                  from 'rxjs';
import { HeroesIntegrationService }         from './heroes-integration.service';
import { Heroe }                            from '../interfaces/heroes.interface';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private _storage: Storage | null = null;
  private _localPersonajes: any[] = [];
  public favoritos$ = new BehaviorSubject<any[]>([]);

  constructor(
    private storage: Storage,
    private heroesIntSvc: HeroesIntegrationService
  ) {
    this.init();
  }

  private async init() {
    this._storage = await this.storage.create();
    await this.loadFavorites();
  }

  private async loadFavorites() {
    const personajes = await this._storage?.get('personajes');
    this._localPersonajes = personajes || [];
    this.favoritos$.next(this._localPersonajes);

    // Al iniciar, sincroniza con la API aquellos que estén en favoritos
    this.heroesIntSvc.syncFavorites(this._localPersonajes).forEach(obs =>
      obs.subscribe({
        next: hero => console.log('Sincronizado héroe:', hero),
        error: err => console.error('Error sincr. héroe:', err)
      })
    );
  }

  personajeInFavorites(personaje: any) {
    return !!this._localPersonajes.find(p => p.id === personaje.id);
  }

  /**
   * Añade o quita un personaje de favoritos;
   * si se añade, lo envía a la API como héroe.
   */
  public async saveRemovePersonaje(personaje: any): Promise<void> {
    const exists = this.personajeInFavorites(personaje);

    if (exists) {
      // Quitar de favoritos
      this._localPersonajes = this._localPersonajes.filter(p => p.id !== personaje.id);
    } else {
      // Añadir a favoritos
      this._localPersonajes = [personaje, ...this._localPersonajes];
      // Crear en la API
      this.heroesIntSvc.createHeroFromCharacter(personaje)
        .subscribe({
          next: hero => console.log('Héroe creado:', hero),
          error: err   => console.error('Error creando héroe:', err)
        });
    }

    await this._storage?.set('personajes', this._localPersonajes);
    this.favoritos$.next(this._localPersonajes);
  }
}