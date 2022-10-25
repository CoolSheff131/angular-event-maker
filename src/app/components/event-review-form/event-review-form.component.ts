import { AfterViewInit, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Event } from 'src/app/api/interfaces/event.interface';
import { EventReview } from 'src/app/api/interfaces/eventReview.interface';
import { User } from 'src/app/api/interfaces/user.interface';
import { EventReviewService } from 'src/app/pages/admin/services/eventReview.service';
import { UserService } from 'src/app/pages/admin/services/user.service';

@Component({
  selector: 'app-event-review-form',
  templateUrl: './event-review-form.component.html',
  styleUrls: ['./event-review-form.component.css'],
})
export class EventReviewFormComponent implements AfterViewInit {
  @Input()
  event!: Event;

  @Input()
  eventReview: EventReview | undefined;

  previewImagesUrls: SafeUrl[] | undefined;

  authedUser: User | undefined;
  eventReviewForm = new FormGroup({
    text: new FormControl<string>('', [Validators.required]),
    rate: new FormControl<number>(1, [Validators.required]),
    images: new FormControl<File[] | null>(null),
  });

  constructor(
    private eventReviewsService: EventReviewService,
    private userService: UserService,
    private domSanitizer: DomSanitizer
  ) {
    this.userService.authedUser$.subscribe((user) => {
      this.authedUser = user;
    });
  }
  ngAfterViewInit(): void {
    if (this.eventReview) {
      this.eventReviewForm.setValue({
        text: this.eventReview.text,
        images: null,
        rate: this.eventReview.rate,
      });
    }
  }

  get isEditing(): boolean {
    return this.eventReview !== undefined;
  }

  handleFileChange(event: any) {
    this.eventReviewForm.controls.images.setValue(
      Array.from(event.target.files)
    );
    if (this.eventReviewForm.controls.images.value) {
      this.previewImagesUrls = this.eventReviewForm.controls.images.value.map(
        (f) => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(f))
      );
    }
  }

  onSubmitEventReview() {
    if (!this.authedUser) {
      return;
    }
    if (this.eventReviewForm.invalid) {
      this.eventReviewForm.markAllAsTouched();
      return;
    }
    if (this.isEditing) {
      this.eventReviewsService.updateEventReview(
        this.event.id,
        this.authedUser,
        this.eventReviewForm.controls.text.value!,
        this.eventReviewForm.controls.images.value!,
        this.eventReviewForm.controls.rate.value!,
        this.event
      );
    } else {
      this.eventReviewsService.createEventReview(
        this.eventReviewForm.controls.images.value!,
        this.eventReviewForm.controls.rate.value!,
        this.eventReviewForm.controls.text.value!,
        this.authedUser,
        this.event
      );
    }
  }
}
