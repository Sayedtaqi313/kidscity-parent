import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  beliefs = [
    'Family time should be fun, not frustrating.',
    'Every city and destination has something special to offer kids.',
    "Great experiences don't have to be expensive or hard to find.",
    'Planning a trip or a weekend should feel exciting, not overwhelming.',
    'Local and independent organizers deserve visibility and support.',
  ];

  features = [
    {
      icon: 'puzzle',
      title: 'Explore Activities',
      description:
        'Local events, creative workshops, nature play, and more — all tailored by age, time, and interests.',
    },
    {
      icon: 'airplane',
      title: 'Plan Family Trips',
      description:
        'Book full experiences, including tickets, hotels, and flights — all in one place.',
    },
    {
      icon: 'filter',
      title: 'Smart Filters',
      description:
        'Find exactly what fits your family — sort by age, type, location, cost, and indoor/outdoor options.',
    },
    {
      icon: 'map',
      title: 'Interactive Map',
      description:
        "Visualize what's nearby or find something worth traveling for, with built-in map browsing.",
    },
    {
      icon: 'bookmark',
      title: 'Save & Book Easily',
      description:
        'Create an account to favorite activities, track your bookings, and organize your plans effortlessly.',
    },
  ];
}
