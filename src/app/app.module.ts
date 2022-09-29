import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EventsComponent } from './pages/events/events.component';
import { EventComponent } from './pages/event/event.component';
import { EventItemComponent } from './components/event-item/event-item.component';
import { RouterModule, Routes } from '@angular/router';
import { EventCreateComponent } from './pages/event-create/event-create.component';
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
import { AuditoriesComponent } from './pages/auditories/auditories.component';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { UsersComponent } from './pages/users/users.component';
import { EventTagsComponent } from './pages/event-tags/event-tags.component';
const routes: Routes = [
  { path: '', component: EventsComponent },
  { path: 'events/:id', component: EventComponent },
  { path: 'event-create', component: EventCreateComponent },
  { path: 'event-tag', component: AuditoriesComponent },
  { path: 'auditories', component: AuditoriesComponent },
  { path: 'groups', component: AuditoriesComponent },
  { path: 'users', component: AuditoriesComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    EventComponent,
    EventItemComponent,
    EventCreateComponent,
    AuditoriesComponent,
    UsersComponent,
    EventTagsComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
