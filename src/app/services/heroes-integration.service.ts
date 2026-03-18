import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Heroe }      from '../interfaces/heroes.interface';
import { URL_HEROES } from '../config/url.servicios';

@Injectable({ providedIn: 'root' })
export class HeroesIntegrationService {
  private apiUrl = `${URL_HEROES}/heroes`;

  constructor(private http: HttpClient) {}

  /**
   * Transforma un personaje de Rick & Morty en tu modelo Heroe
   * y lo publica a tu API vía POST.
   */
// src/app/services/heroes-integration.service.ts
createHeroFromCharacter(character: any) {
  const nuevo: Heroe = {
    // _id eliminado
    nombre:    character.name,
    bio:       `Especie: ${character.species}. Estado: ${character.status}.`,
    img:       character.image,
    aparicion: 'ricky morty',  // fijo
    casa:      ''              // permitido si ajustas el esquema
  };
  return this.http.post<Heroe>(this.apiUrl, nuevo);
}


  /**
   * Sincroniza todos los personajes favoritos con la API,
   * creando un héroe por cada favorito.
   */
  syncFavorites(characters: any[]) {
    return characters.map(character =>
      this.createHeroFromCharacter(character)
    );
  }
}
