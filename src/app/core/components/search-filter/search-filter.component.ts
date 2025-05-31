import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { SnackbarService } from '../../services/snackbar.service';
import { LocationService } from '../../services/location.service';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css'],
})
export class SearchFilterComponent implements OnDestroy {
  locationFocused = false;
  searchForm: FormGroup;
  activityTypes = [
    { label: 'Indoor', value: 'indoor', icon: 'fas fa-home' },
    { label: 'Outdoor', value: 'outdoor', icon: 'fas fa-tree' },
  ];

  suggestions: any[] = [];
  loadingSuggestions = false;
  loadingSearch = false;
  selectedActivity: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private searchService: SearchService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      location: [''],
      minAge: [null, [Validators.min(1)]],
      maxAge: [null, [Validators.max(14)]],
      activityType: [''],
    });

    this.searchForm
      .get('location')!
      .valueChanges.pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
        switchMap((q: string) => {
          if (q.length > 2) {
            this.loadingSuggestions = true;
            return this.locationService.getGeoLocationSuggestion(q);
          } else {
            this.suggestions = [];
            return [];
          }
        })
      )
      .subscribe({
        next: (res: any[]) => {
          this.suggestions = res;
          this.loadingSuggestions = false;
        },
        error: () => {
          this.suggestions = [];
          this.loadingSuggestions = false;
          this.snackbarService.openSnackbar(
            'Error loading location suggestions',
            'bg-warning'
          );
        },
      });
  }

  onLocationBlur() {
    setTimeout(() => {
      this.locationFocused = false;
    }, 200);
  }

  toggleActivityType(type: string) {
    const current = this.searchForm.value.activityType;
    const next = current === type ? '' : type;
    this.selectedActivity = next;
    this.searchForm.patchValue({ activityType: next });
  }
  get locationControl() {
    return this.searchForm.get('location') as FormControl;
  }
  onLocationSelect(suggestion: any) {
    this.searchForm.patchValue({
      location: suggestion.formatted,
      lat: suggestion.geometry.lat,
      lng: suggestion.geometry.lng,
    });
    this.suggestions = [];
  }
  onLocationInput(event: any) {
    const query = event.target.value;
    if (query.length > 3) {
      this.locationService.getGeoLocationSuggestion(query).subscribe({
        next: (res: any) => {
          this.suggestions = res;
        },
        error: (err) => {
          this.snackbarService.openSnackbar(
            'Unknown error occurred while loading locations please check you internet',
            'bg-warning'
          );
        },
      });
    }
  }

  onSearch() {
    if (this.searchForm.invalid) return;
    this.loadingSearch = true;
    this.router.navigate(['/home/search-result'], {
      queryParams: this.searchForm.value,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
