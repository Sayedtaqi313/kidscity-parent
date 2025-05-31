import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActivityService } from '../../../core/services/activity.service';
import { map, Subscription, switchMap } from 'rxjs';
import { BookingService } from '../../../core/services/booking.service';
import { environment } from '../../../environments/environment';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css'],
})
export class ActivityDetailComponent implements OnInit {
  activity: any;
  type: string = '';
  isLoading: boolean = false;
  buttonLoading: boolean = false;
  activityStatus: string | null = '';
  fileUrl = environment.fileUrl;
  paramsMapSubscription: Subscription | undefined;

  constructor(
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.paramsMapSubscription = this.route.paramMap
      .pipe(
        switchMap((param: ParamMap) => {
          const id = param.get('id')!;
          this.type = param.get('type')!;
          return this.activityService.getActivityById(id);
        }),
        map((res: any) => {
          if (res.createdBy.imageUrl !== null) {
            res.createdBy.imageUrl = `${this.fileUrl}/profiles/${res.createdBy.imageUrl}`;
          }
          return res;
        })
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.activityStatus = 'status' in res ? res?.status : null;
          this.activity = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.snackbarService.openSnackbar(err.error.message, 'bg-warning');
          this.isLoading = false;
        },
      });
  }

  joinActivity(id: string) {
    this.buttonLoading = true;
    this.bookingService
      .joinActivity(id)
      .pipe(
        map((res: any) => {
          res.imageUrl = `${this.fileUrl}/${res.imageUrl}`;
          if (res.createdBy.imageUrl !== null) {
            res.createdBy.imageUrl = `${this.fileUrl}/profiles/${res.createdBy.imageUrl}`;
          }
          return res;
        })
      )
      .subscribe({
        next: (res) => {
          console.log('form join', res);
          this.activityStatus = res.status ?? null;
          this.activity = res;
          this.snackbarService.openSnackbar(
            'You joined this activity successfully',
            'bg-success'
          );
          this.buttonLoading = false;
        },
        error: (err) => {
          this.buttonLoading = false;
          if (err.status === 401) {
            this.snackbarService.openSnackbar(
              'You need to sign in first',
              'bg-warning'
            );
          } else {
            this.snackbarService.openSnackbar(err.error.message, 'bg-warning');
          }
        },
      });
  }

  cancelRequest(id: string) {
    this.buttonLoading = true;
    this.bookingService.cancelActivity(id).subscribe({
      next: (res) => {
        this.activityStatus = res.activity.status ?? null;
        this.activity = res.activity;
        this.snackbarService.openSnackbar(res.message, 'bg-success');
        this.buttonLoading = false;
      },
      error: (err) => {
        this.buttonLoading = false;
        this.snackbarService.openSnackbar(err.error.message, 'bg-warning');
      },
    });
  }

  ngOnDestroy() {
    if (this.paramsMapSubscription) {
      this.paramsMapSubscription.unsubscribe();
    }
  }
}
