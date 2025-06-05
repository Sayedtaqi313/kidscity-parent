// search-result.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../core/services/search.service';
import { LocationService } from '../../../core/services/location.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultsComponent implements OnInit {
  searchForm: FormGroup;
  activities: any[] = [];
  isLoading = false;
  locationFocused = false;
  suggestions: any[] = [];
  selectedActivity: string | null = null;

  activityTypes = [
    { label: 'Indoor', value: 'indoor', icon: 'fas fa-home' },
    { label: 'Outdoor', value: 'outdoor', icon: 'fas fa-tree' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private snackbarService: SnackbarService
  ) {
    this.searchForm = this.fb.group({
      location: [''],
      minAge: [null],
      maxAge: [null],
      activityType: [null],
    });
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.searchForm.patchValue(params, { emitEvent: false });
      });
    this.performSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  performSearch() {
    this.isLoading = true;
    const formValue = this.searchForm.value;

    this.router.navigate([], {
      queryParams: formValue,
      replaceUrl: true,
    });

    this.searchService
      .search(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.activities = res.activities || [];
          this.isLoading = false;
        },
        error: (error) => {
          this.snackbarService.openSnackbar(
            'Error searching activities. Please try again.',
            'bg-warning'
          );
          this.isLoading = false;
        },
      });
  }

  onLocationBlur() {
    setTimeout(() => {
      this.locationFocused = false;
    }, 300);
  }

  toggleActivityType(type: string) {
    this.selectedActivity = this.selectedActivity === type ? null : type;
    this.searchForm.patchValue({ activityType: this.selectedActivity });
  }

  onLocationSelect(suggestion: any) {
    this.searchForm.patchValue({
      location: suggestion.formatted,
    });

    this.searchForm.markAsDirty();
    this.searchForm.updateValueAndValidity();

    this.suggestions = [];
    this.locationFocused = false;

    setTimeout(() => {
      this.suggestions = [];
      this.locationFocused = false;
    }, 0);
  }
  onLocationInput(event: any) {
    this.locationFocused = true;
    const query = event.target.value;
    if (query.length > 2) {
      this.locationService.getGeoLocationSuggestion(query).subscribe({
        next: (res: any) => {
          this.suggestions = res;
        },
        error: (err) => {
          this.snackbarService.openSnackbar(
            'Location service unavailable. Please check your connection.',
            'bg-warning'
          );
        },
      });
    }
  }

  private handleLocationError() {
    this.snackbarService.openSnackbar(
      'Location service unavailable. Please check your connection.',
      'bg-warning'
    );
    this.suggestions = [];
  }

  get locationControl() {
    return this.searchForm.get('location') as FormControl;
  }
}
