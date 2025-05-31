import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { lastValueFrom } from 'rxjs';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-activities-slider',
  templateUrl: './activities-slider.component.html',
})
export class ActivitiesSliderComponent {
  @ViewChild('slider') slider!: ElementRef;

  @Input() activities: any[] = [];
  @Input() title = 'Activities';
  @Input() isAlternative = false;
  @Input() showAlternative = false;

  activeIndex = 0;
  activeAltIndex = 0;
  dots: number[] = [];
  altDots: number[] = [];
  constructor(
    private dialogService: DialogService,
    private router: Router,
    private snackbarService: SnackbarService,
    private bookingService: BookingService
  ) {}
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

  private updateActivityStatus(id: string, isJoined: boolean) {
    const activity = this.activities.find((a) => a.id === id);
    if (activity) activity.isJoined = isJoined;
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/home', 'all', id, 'activity']);
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
}
