import { LoadingIndicatorService } from './providers/loadingIndicatorStatus';
import { MoviedbService } from './providers/moviedb.service';
import { NeedAuthGuard } from './providers/auth.guard';
import { AuthService } from './providers/auth.service';
import { UserService } from './providers/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import {
  MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule,
  MatButtonModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatProgressSpinnerModule, MatBadgeModule, MatChipsModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ScrollDispatchModule, ScrollingModule } from '@angular/cdk/scrolling';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { FooterComponent } from './layout/footer/footer.component';
import { BrowseMoviesComponent } from './pages/browse-movies/browse-movies.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LandingComponent,
    HomepageComponent,
    MovieDetailsComponent,
    FooterComponent,
    BrowseMoviesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ScrollDispatchModule,
    ScrollingModule,
    MatBadgeModule,
    MatChipsModule,
    FormsModule,
    MatSidenavModule
  ],
  providers: [
    UserService,
    AuthService,
    NeedAuthGuard,
    MoviedbService,
    LoadingIndicatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
