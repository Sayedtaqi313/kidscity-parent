import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';
import { ActivityService } from '../../../core/services/activity.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-subscribed-activities',
  templateUrl: './subscribed-activities.component.html',
  styleUrls: ['./subscribed-activities.component.css'],
  animations: [
    trigger('slideOut', [
      transition(':leave', [
        animate(
          '300ms ease-in-out',
          style({ transform: 'translateX(-100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class SubscribedActivitiesComponent implements OnInit {
  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('sliderAlt') sliderAlt!: ElementRef;
  pendingActivities: any[] = [];
  confirmedActivities: any[] = [];
  activeIndex = 0;
  activeAltIndex = 0;
  dots: number[] = [];
  altDots: number[] = [];
  isLoading: boolean = false;
  cancellingActivities: { [key: string]: boolean } = {};

  constructor(
    private bookingService: BookingService,
    private activityService: ActivityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBookedActivities();
  }

  getBookedActivities() {
    this.isLoading = true;
    this.bookingService.getBookedActivities().subscribe({
      next: (res) => {
        this.pendingActivities = res.pendingActivities;
        this.confirmedActivities = res.confirmedActivities;
        this.updateDots();
        this.updateAltDots();
        this.isLoading = false;
      },
      error: (err) => console.error(err),
    });
  }

  cancelRequest(id: string) {
    this.cancellingActivities[id] = true;

    // Optimistic UI update
    const pendingIndex = this.pendingActivities.findIndex((a) => a.id === id);
    const confirmedIndex = this.confirmedActivities.findIndex(
      (a) => a.id === id
    );

    if (pendingIndex > -1) this.pendingActivities.splice(pendingIndex, 1);
    if (confirmedIndex > -1) this.confirmedActivities.splice(confirmedIndex, 1);

    this.bookingService.cancelActivity(id).subscribe({
      next: () => {
        this.updateDots();
        this.updateAltDots();
      },
      error: (err) => {
        console.error(err);
        // Revert optimistic update
        this.getBookedActivities();
      },
      complete: () => delete this.cancellingActivities[id],
    });
  }

  // Keep all existing scroll methods unchanged
  updateDots() {
    const totalDots = Math.ceil(this.confirmedActivities.length);
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
    const totalAltDots = Math.ceil(this.pendingActivities.length);
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
    this.router.navigate(['home', 'all', id, 'activity']);
  }
}
