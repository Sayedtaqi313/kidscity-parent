import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-sub-activity',
  templateUrl: './no-subscribed-activity.component.html',
  styleUrls: ['./no-subscribed-activity.component.css'],
})
export class NoSubscribedActivityComponent {
  @Input('message') message = '';
}
