import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { SearchResultsComponent } from './components/search-result/search-result.component';
const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'activities',
        component: ActivitiesComponent,
      },
      {
        path: ':type/activities',
        component: ActivitiesComponent,
      },
      {
        path: ':type/:id/activity',
        component: ActivityDetailComponent,
      },
      {
        path: 'search-result',
        component: SearchResultsComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
