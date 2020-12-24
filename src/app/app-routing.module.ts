import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { BreedComponent } from './breed/breed.component';
import { AdoptComponent } from './adopt/adopt.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CatComponent } from './cat/cat.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'cat/:id',
    component: CatComponent
  },
  {
    path: 'adopt',
    component: AdoptComponent,
    pathMatch: 'full'
  },
  {
    path: 'breed',
    component: BreedComponent,
    pathMatch: 'full'
  },
  {
    path: 'faq',
    component: FaqComponent,
    pathMatch: 'full'
  },
  {
    path: 'catalog',
    component: CatalogComponent,
    pathMatch: 'full'
  },
  // wildcard
  {
    path: '**',
    component: HomeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
