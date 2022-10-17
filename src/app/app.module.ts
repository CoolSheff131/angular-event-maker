import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EventComponent } from './pages/user/event/event.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password';
import { AdminAuditoriesComponent } from './pages/admin/auditories/auditories.component';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { AdminUsersComponent } from './pages/admin/users/users.component';
import { AdminEventTagsComponent } from './pages/admin/event-tags/event-tags.component';
import { AdminGroupsComponent } from './pages/admin/groups/groups.component';
import { AdminEventReviewsComponent } from './pages/admin/event-reviews/event-reviews.component';
import { AdminEventsComponent } from './pages/admin/events/events.component';
import { EventsComponent } from './pages/user/events/events.component';
import { AdminModule } from './pages/admin/admin.module';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { ImageModule } from 'primeng/image';
import { PersonalCabinetComponent } from './pages/user/personal-cabinet/personal-cabinet.component';
import { EventItemComponent } from './components/event-item/event-item.component';
import { ChartModule } from 'primeng/chart';
import { AdminUserRolesComponent } from './pages/admin/user-roles/user-roles.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeRu, 'ru');
const routes: Routes = [
  { path: '', component: EventsComponent },
  { path: 'events/:id', component: EventComponent },
  { path: 'events', component: AdminEventsComponent },
  { path: 'event-reviews', component: AdminEventReviewsComponent },
  { path: 'event-tags', component: AdminEventTagsComponent },
  { path: 'auditories', component: AdminAuditoriesComponent },
  { path: 'groups', component: AdminGroupsComponent },
  { path: 'users', component: AdminUsersComponent },
  { path: 'user-roles', component: AdminUserRolesComponent },
  { path: 'personal-cabinet', component: PersonalCabinetComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    EventComponent,
    PersonalCabinetComponent,
    EventItemComponent,
    AdminUserRolesComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
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
    MessagesModule,
    MessageModule,
    TooltipModule,
    ChartModule,
    AdminModule,
    RatingModule,
    OverlayPanelModule,

    ImageModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
