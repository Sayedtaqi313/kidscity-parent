import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './components/dashboardLayoutComponent/dashboardLayoutComponent';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscribedActivitiesComponent } from './components/subscribed-activities/subscribed-activities.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'subscribed-activities',
        component: SubscribedActivitiesComponent,
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
