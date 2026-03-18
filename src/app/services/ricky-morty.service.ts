import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RickyMortyService {
  private baseUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  getCharactersPaginated(page: number = 1) {
    return this.http.get<any>(`${this.baseUrl}/character/?page=${page}`);
  }

  getEpisodesPaginated(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/episode?page=${page}`);
  }

  getAllEpisodes() {
    return this.http.get<any>(`${this.baseUrl}/episode`);
  }

  getCharactersByIds(ids: number[]): Observable<any> {
    if (ids.length === 0) return new Observable(obs => { obs.next([]); obs.complete(); });
    if (ids.length === 1) {
      return new Observable(obs => {
        this.http.get<any>(`${this.baseUrl}/character/${ids[0]}`).subscribe(c => {
          obs.next([c]);
          obs.complete();
        });
      });
    }
    return this.http.get<any>(`${this.baseUrl}/character/${ids.join(',')}`);
  }

  getCharacterById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/character/${id}`);
  }
}
