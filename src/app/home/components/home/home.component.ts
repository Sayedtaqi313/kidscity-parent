import { Component } from '@angular/core';
import { activityColors } from '../../../core/types/activities-colors.type';
import { ActivityService } from '../../../core/services/activity.service';
import { Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
