import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { AdminAuditoriesComponent } from './auditories/auditories.component';
import { AdminEventReviewsComponent } from './event-reviews/event-reviews.component';
import { AdminEventTagsComponent } from './event-tags/event-tags.component';
import { AdminEventsComponent } from './events/events.component';
import { AdminGroupsComponent } from './groups/groups.component';
import { AdminUsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    AdminAuditoriesComponent,
    AdminUsersComponent,
    AdminEventTagsComponent,
    AdminGroupsComponent,
    AdminEventReviewsComponent,
    AdminEventsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    MultiSelectModule,
    InputTextModule,
    CalendarModule,
    InputTextareaModule,
    InputNumberModule,
    FileUploadModule,
    HttpClientModule,
    DataViewModule,
    CardModule,
    DropdownModule,
    GalleriaModule,
    AccordionModule,
    TableModule,
    ProgressBarModule,
    TagModule,
    SidebarModule,
    TabViewModule,
    PasswordModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    RadioButtonModule,
    RatingModule,
  ],
})
export class AdminModule {}
