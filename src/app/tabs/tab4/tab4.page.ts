import { Component, OnInit } from '@angular/core';
import { RickyMortyService } from 'src/app/services/ricky-morty.service';
import { EpisodioCardComponent } from 'src/app/components/episodio-card/episodio-card.component';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab4',
  standalone: true,
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    EpisodioCardComponent, IonInfiniteScroll, IonInfiniteScrollContent,
    IonItem, IonLabel
  ],
})
export class Tab4Page implements OnInit {
  episodios: any[] = [];
  page = 1;
  loading = false;
  allLoaded = false;

  constructor(private api: RickyMortyService) {}

  ngOnInit() {
    this.loadMore();
  }

  loadMore(event?: any) {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    this.api.getEpisodesPaginated(this.page).subscribe(data => {
      this.episodios = [...this.episodios, ...data.results];
      this.page++;
      this.loading = false;
      event?.target.complete();

      if (!data.info.next) {
        this.allLoaded = true;
      }
    });
  }
}
