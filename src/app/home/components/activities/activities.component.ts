// activities.component.ts
import { DialogService } from './../../../core/services/dialog.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivityService } from '../../../core/services/activity.service';
import { BookingService } from '../../../core/services/booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { activityColors } from '../../../core/types/activities-colors.type';
import { lastValueFrom } from 'rxjs';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent {
  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('sliderAlt') sliderAlt!: ElementRef;
  activeIndex = 0;
  activeAltIndex = 0;
  dots: number[] = [];
  altDots: number[] = [];
  activityColors = activityColors;
  activities: any[] = [];
  alternativeActivities: any[] = [];
  matchCityActivities: any[] = [];
  isLoading: boolean = false;
  type: string = '';
  status: string = '';
  constructor(
    private activityService: ActivityService,
    private router: Router,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private snackbarService: SnackbarService
  ) {}
  ngOnInit(): void {
    this.bookingService.callActivityFunction$.subscribe((refreshType) => {
      if (refreshType === 'In' || refreshType === 'Out') {
        this.refreshActivitiesByLocation(refreshType);
      } else if (refreshType == 'Indoor' || refreshType == 'Outdoor') {
        this.refreshActivitiesByType(refreshType);
      } else {
        this.refreshAllActivities();
      }
    });

    this.type = this.route.snapshot.params['type'];
    if (this.type) {
      if (this.type === 'In' || this.type === 'Out') {
        this.refreshActivitiesByLocation(this.type);
      } else if (this.type === 'Indoor' || this.type === 'Outdoor') {
        this.refreshActivitiesByType(this.type);
      }
    } else {
      this.refreshAllActivities();
    }
  }
  private refreshActivitiesByLocation(exploreType: string): void {
    this.isLoading = true;
    this.activityService.getActivityByLocation(exploreType).subscribe({
      next: (res) => {
        this.activities = res.activities || [];
        this.alternativeActivities = res.alternativeActivities || [];
        this.updateDots();
        this.updateAltDots();
        this.isLoading = false;
      },
      error: (error) => {
        this.activities = [];
        this.alternativeActivities = [];
        this.isLoading = false;
        this.handleError(error);
      },
    });
  }

  private handleError(error: any): void {
    console.error(error);
    this.snackbarService.openSnackbar(
      'Failed to load activities. Please try again later.',
      'bg-error'
    );
  }
  private refreshActivitiesByType(type: string): void {
    this.isLoading = true;
    this.activityService.getActivityByType(type).subscribe({
      next: (res) => {
        this.activities = res.activities;
        this.alternativeActivities = res.alternativeActivities;
        this.updateDots();
        this.updateAltDots();
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  private refreshAllActivities(): void {
    this.isLoading = true;
    this.activityService.getActivities().subscribe({
      next: (res) => {
        this.activities = res.activities;
        this.alternativeActivities = res.alternativeActivities;
        this.updateDots();
        this.updateAltDots();
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }
  getMainActivityHeader(): string {
    if (this.type === 'Indoor') return 'Explore Indoor Activities';
    if (this.type === 'Outdoor') return 'Explore Outdoor Activities';
    if (this.type === 'In') return 'Local Activities Near You!';
    if (this.type === 'Out') return 'Activities Beyond Your City!';
    return 'Upcoming Activities (Next 5 Days)';
  }

  getAlternativeActivityHeader(): string {
    if (this.type === 'Indoor') return 'Suggested Outdoor Activities';
    if (this.type === 'Outdoor') return 'Suggested Indoor Activities';
    if (this.type === 'In') return 'Activities in Nearby Cities';
    if (this.type === 'Out') return 'Local Activities You Might Like';
    return 'More Available Activities';
  }
  updateDots() {
    const totalDots = Math.ceil(this.activities.length);
    this.dots = Array.from({ length: totalDots }, (_, i) => i);
  }
  scrollLeft() {
    this.slider.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    this.updateActiveIndex();
  }
  scrollToIndex(index: number) {
    const scrollAmount = index * 300;
    this.slider.nativeElement.scrollTo({
      left: scrollAmount,
      behavior: 'smooth',
    });
    this.activeIndex = index;
  }
  updateActiveIndex() {
    const scrollLeft = this.slider.nativeElement.scrollLeft;
    this.activeIndex = Math.round(scrollLeft / 300);
  }
  scrollRight() {
    this.slider.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    this.updateActiveIndex();
  }

  updateAltDots() {
    const totalAltDots = Math.ceil(this.alternativeActivities.length);
    this.altDots = Array.from({ length: totalAltDots }, (_, i) => i);
  }
  scrollLeftAlt() {
    this.sliderAlt.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    this.updateAltActiveIndex();
  }
  scrollRightAlt() {
    this.sliderAlt.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    this.updateAltActiveIndex();
  }
  scrollToAltIndex(index: number) {
    const scrollAmount = index * 300;
    this.sliderAlt.nativeElement.scrollTo({
      left: scrollAmount,
      behavior: 'smooth',
    });
    this.activeAltIndex = index;
  }
  updateAltActiveIndex() {
    const scrollLeft = this.sliderAlt.nativeElement.scrollLeft;
    this.activeAltIndex = Math.round(scrollLeft / 300);
  }
  navigateToDetail(id: string) {
    if (!this.type) {
      this.type = 'all';
    }
    this.router.navigate(['/home', this.type, id, 'activity']);
  }
  private updateActivityStatus(id: string, isJoined: boolean) {
    const mainActivity = this.activities.find((a) => a.id === id);
    if (mainActivity) mainActivity.isJoined = isJoined;
    const altActivity = this.alternativeActivities.find((a) => a.id === id);
    if (altActivity) altActivity.isJoined = isJoined;
  }

  private async cancelActivity(activity: any) {
    if (!activity?.id) {
      console.error('Invalid activity object:', activity);
      this.snackbarService.openSnackbar('Invalid activity', 'bg-error');
      return;
    }
    try {
      const response = await lastValueFrom(
        this.bookingService.cancelActivity(activity.id)
      );
      activity.isJoined = false;
      this.snackbarService.openSnackbar(response.message, 'bg-success');
    } catch (error) {
      console.error('Cancel error:', error);
      this.snackbarService.openSnackbar('Error canceling activity', 'bg-error');
    }
  }
  private async joinActivity(id: string) {
    try {
      await this.bookingService.joinActivity(id).toPromise();
      this.updateActivityStatus(id, true);
    } catch (err: any) {
      if (err.status === 401) {
        this.snackbarService.openSnackbar(
          'First you need to sign in',
          'bg-warning'
        );
      } else {
        this.snackbarService.openSnackbar(err?.error.message, 'bg-warning');
      }
    }
  }
  async handleActivityAction(activity: any) {
    if (activity.isJoined) {
      await this.cancelActivity(activity);
    } else {
      const confirmed = await this.dialogService.show(
        'Are you sure you want to join this activity?',
        'Confirm Participation',
        'Join Now',
        'Not Sure'
      );
      if (confirmed) {
        await this.joinActivity(activity.id);
      }
    }
  }
}
