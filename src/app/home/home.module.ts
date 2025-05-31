import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { HomeComponent } from './components/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { SearchResultsComponent } from './components/search-result/search-result.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    ActivityDetailComponent,
    HomeLayoutComponent,
    ActivitiesComponent,
    SearchResultsComponent,
  ],
  imports: [CommonModule, CoreModule, HomeRoutingModule, ReactiveFormsModule],
  exports: [
    HomeComponent,
    ActivityDetailComponent,
    HomeLayoutComponent,
    ActivitiesComponent,
    SearchResultsComponent,
  ],
})
export class HomeModule {}
