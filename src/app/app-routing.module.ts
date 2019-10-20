import { BrowseMoviesComponent } from './pages/browse-movies/browse-movies.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NeedAuthGuard } from './providers/auth.guard';


const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  canActivate: [NeedAuthGuard],
  children: [
    {
      path: '',
      component: HomepageComponent,
      canActivate: [NeedAuthGuard]
    },
    {
      path: 'movie/:movieid',
      component: MovieDetailsComponent,
      canActivate: [NeedAuthGuard]
    },
    {
      path: 'browse/:mode',
      component: BrowseMoviesComponent,
      canActivate: [NeedAuthGuard]
    },
    {
      path: 'find/:query',
      component: BrowseMoviesComponent,
      canActivate: [NeedAuthGuard]
    },
  ]
},
{
  path: 'landing',
  component: LandingComponent
},
{ path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
