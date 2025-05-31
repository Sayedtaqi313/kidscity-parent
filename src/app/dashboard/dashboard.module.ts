import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CoreModule } from '../core/core.module';
import { DashboardLayoutComponent } from './components/dashboardLayoutComponent/dashboardLayoutComponent';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscribedActivitiesComponent } from './components/subscribed-activities/subscribed-activities.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    ProfileComponent,
    SubscribedActivitiesComponent,
    NotificationsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    DashboardLayoutComponent,
    ProfileComponent,
    SubscribedActivitiesComponent,
    NotificationsComponent,
  ],
})
export class DashboardModule {}
