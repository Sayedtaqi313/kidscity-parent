import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { NotificationsService } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isSidebarOpen = false;
  isSearchOpen = false;
  isProfileMenuOpen = false;
  count: number = 0;
  filters = {
    ageRange: '',
    city: '',
    activityType: '',
  };

  isLoggedIn: boolean = false;
  isLoggedInSubs!: Subscription;
  isInit: boolean = false;
  isMenuOpen: boolean = false;
  notificationCount$!: Observable<number>;
  user: any;
  constructor(
    public authService: AuthService,
    private notificationsService: NotificationsService
  ) {}
  ngOnInit() {
    this.notificationCount$ = this.notificationsService.count$;

    this.isLoggedInSubs = this.authService.isAuthenticatedSubject
      .pipe()
      .subscribe((status) => {
        if (status !== null) {
          this.isLoggedIn = status;
          this.isInit = true;
        }
      });

    this.user = this.authService.getUser();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const profileButton = document.getElementById('profile-button');
    const profileMenu = document.getElementById('profile-menu');

    if (
      !profileButton?.contains(event.target as Node) &&
      !profileMenu?.contains(event.target as Node)
    ) {
      this.isProfileMenuOpen = false;
    }
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  onScroll(scrolled: boolean) {
    this.isScrolled = scrolled;
  }

  logout() {
    this.toggleSidebar();
    this.authService.logout();
    this.isProfileMenuOpen = false;
    this.isSidebarOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  ngOnDestroy(): void {
    if (this.isLoggedInSubs) {
      this.isLoggedInSubs.unsubscribe();
    }
  }
}
