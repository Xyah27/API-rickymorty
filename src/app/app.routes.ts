import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () => import('./tabs/tab1/tab1.page').then(m => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () => import('./tabs/tab2/tab2.page').then(m => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () => import('./tabs/tab3/tab3.page').then(m => m.Tab3Page),
      },
      {
        path: 'tab4',
        loadComponent: () => import('./tabs/tab4/tab4.page').then(m => m.Tab4Page),
      },
      {
        path: 'tab5',
        loadComponent: () => import('./tabs/tab5/tab5.page').then(m => m.Tab5Page),
      },
    ],
  },
  {
    path: 'mapa',
    loadComponent: () => import('./components/pages/mapa/mapa.page').then( m => m.MapaPage)
  },
];
