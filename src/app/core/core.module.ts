import { SvgIconComponent } from './components/svg-icon/svg-icon.comonent';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { HomeContentComponent } from './components/home-content/home-content.component';

import {
  LucideAngularModule,
  LogIn,
  LogOut,
  UserPlus,
  Rocket,
  Menu,
  ArrowRight,
  Star,
  Home,
  Gift,
  Heart,
  Sparkles,
  Search,
  MapPin,
  Sun,
  Moon,
  X,
  Linkedin,
  Facebook,
  Youtube,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  Mail,
  Info,
  HelpCircle,
  PlusCircle,
  Image,
  Users,
  Clock,
  Calendar,
  Upload,
  Activity,
  User,
  Baby,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Box,
  Bell,
  List,
  BookmarkCheck,
  Camera,
} from 'lucide-angular';
import { BannerComponent } from './components/banner/banner.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { ScrollDirective } from './directives/window-scroll.directive';
import { LoaderComponent } from './components/loader/loader.component';
import { NoActivityComponent } from './components/no-activity/no-activity.component';
import { NoSubscribedActivityComponent } from './components/no-subscribed-activity/no-subscribed-activity.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ActivitiesSliderComponent } from './components/activities-slider/activities-slider.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SnackbarComponent,
    HomeContentComponent,
    BannerComponent,
    SearchFilterComponent,
    ScrollDirective,
    LoaderComponent,
    NoActivityComponent,
    NoSubscribedActivityComponent,
    DialogComponent,
    ActivitiesSliderComponent,
    SvgIconComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
      LogIn,
      LogOut,
      UserPlus,
      Rocket,
      Menu,
      ArrowRight,
      Star,
      Home,
      Gift,
      Heart,
      Sparkles,
      Search,
      MapPin,
      Calendar,
      Sun,
      Moon,
      X,
      Linkedin,
      Facebook,
      Youtube,
      Mail,
      ArrowLeft,
      Lock,

      Eye,
      EyeOff,
      Info,
      HelpCircle,
      PlusCircle,
      Image,
      Users,
      Clock,
      Upload,
      Activity,
      User,
      CheckCircle,
      Baby,
      ChevronLeft,
      ChevronRight,
      Box,
      Bell,
      List,
      BookmarkCheck,
      Camera,
    }),
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SnackbarComponent,
    HomeContentComponent,
    BannerComponent,
    LucideAngularModule,
    SearchFilterComponent,
    LoaderComponent,
    NoActivityComponent,
    NoSubscribedActivityComponent,
    DialogComponent,
    ActivitiesSliderComponent,
    SvgIconComponent,
  ],
})
export class CoreModule {}
