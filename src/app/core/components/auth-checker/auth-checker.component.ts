import {
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-auth-checker',
  templateUrl: './auth-checker.component.html',
  styleUrls: ['./auth-checker.component.css'],
})
export class AuthCheckerComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const pin = this.route.snapshot.params['pin'];
      this.authService.check(pin);
    }
  }
}
