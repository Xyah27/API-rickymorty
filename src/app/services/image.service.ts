import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private images = [
    {
      url: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      title: 'Rick Sanchez',
      description: 'Genio loco de dimensiones infinitas'
    },
    {
      url: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      title: 'Morty Smith',
      description: 'Acompañante fiel y confundido'
    },
    {
      url: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
      title: 'Summer Smith',
      description: 'Hermana valiente con carácter fuerte'
    },
    {
      url: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
      title: 'Beth Smith',
      description: 'Veterinaria con pasado emocional'
    }
  ];

  getAllImages() {
    return this.images;
  }
}

