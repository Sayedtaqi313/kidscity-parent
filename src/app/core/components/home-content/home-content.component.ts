import { HomeCard } from './../../types/home-card.interface';
import { Router } from '@angular/router';
import { activityColors } from './../../types/activities-colors.type';
import { ActivityService } from './../../services/activity.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.css'],
})
export class HomeContentComponent implements OnInit {
  cards: HomeCard[] = [];
  activityCardsType: HomeCard[] = [];
  activityCardsLocation: HomeCard[] = [];
  constructor(
    private activityService: ActivityService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.cards = [
      {
        title: 'Explore Activities',
        description:
          'Find nearby events and family fun, or browse travel experiences like theme parks and weekend escapes.',
        image: 'homecard/explore.jpg',
        tag: 'Browse',
      },
      {
        title: 'Check the Details',
        description:
          'Get all the info you need: schedules, prices, locations, travel packages, and age suitability, everything in one place.',
        image: 'homecard/check.jpg',
        tag: 'Details',
      },
      {
        title: 'Sign Up & Save Favorites',
        description:
          'Create your free account to join activities, save wishlists, and book both local events and full family trips.',
        image: 'homecard/signup.jpg',
        tag: 'Sign Up',
      },
      {
        title: 'Enjoy the Experience',
        description:
          'Whether it’s a nearby park day or a dream family vacation, enjoy stress-free planning and meaningful memories.',
        image: 'homecard/enjoy.jpg',
        tag: 'Enjoy',
      },
    ];

    this.activityCardsType = [
      {
        title: 'Explore more',
        description:
          'Discover exciting activities and find new passions—start exploring today!',
        image: 'homecard/indoor.jpg',
        tag: 'Indoor',
      },
      {
        title: 'Explore more',
        description:
          'Step outside and enjoy thrilling outdoor adventures waiting for you!',
        image: 'homecard/outdoor.png',
        tag: 'Outdoor',
      },
    ];
    this.activityCardsLocation = [
      {
        title: 'Explore more',
        description:
          'Uncover amazing events and activities happening right in your city!',
        image: 'homecard/inCity.png',
        tag: 'In your city',
      },
      {
        title: 'Explore more',
        description:
          'Travel beyond your city and experience something new and exciting!',
        image: 'homecard/outCity.webp',
        tag: 'Out of your city',
      },
    ];
  }

  exploreMoreType(type: string) {
    this.router.navigate(['home', type, 'activities']);
  }
  exploreMoreLocation(type: string) {
    const typeLocation = type == 'In your city' ? 'In' : 'Out';
    this.router.navigate(['home', typeLocation, 'activities']);
  }
}
