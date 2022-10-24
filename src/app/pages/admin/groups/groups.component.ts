import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { distinctUntilChanged, map, merge, skipWhile, take } from 'rxjs';
import { Group } from 'src/app/api/interfaces/group.interface';
import { GroupService } from 'src/app/pages/admin/services/group.service';

@Component({
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class AdminGroupsComponent {
  isformGroupDialogOpen = false;
  isEditing = false;

  groupIdEdit = '0';
  form = new FormGroup({
    groupName: new FormControl<string>('', [Validators.required]),
  });

  groups: Group[] = [];

  deleteGroupResponce$ = this.groupService.deleteGroupResponce$;
  createGroupResponce$ = this.groupService.createGroupResponce$;
  updateGroupResponce$ = this.groupService.updateGroupResponce$;
  getAllGroupsResponce$ = this.groupService.getAllGroupsResponce$;

  constructor(
    private readonly groupService: GroupService,

    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    groupService.groups$.subscribe((groups) => {
      this.groups = groups;
    });

    merge(this.createGroupResponce$, this.updateGroupResponce$)
      .pipe(
        distinctUntilChanged(),
        map((status) => status === 'pending')
      )
      .subscribe((isDisabled) => {
        if (isDisabled) {
          this.form.disable();
        } else {
          this.form.enable();
        }
      });
  }

  editGroup(group: Group) {
    this.isEditing = true;
    this.groupIdEdit = group.id;
    this.form.patchValue({ groupName: group.name });
    this.openAddDialog();
  }
  deleteGroup(group: Group) {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите данные о группе?',
      accept: () => {
        this.groupService.deleteGroup(group);

        this.deleteGroupResponce$
          .pipe(
            skipWhile((responce) => responce === 'pending'),
            take(1)
          )
          .subscribe((responce) => {
            if (responce === 'success') {
              this.messageService.add({
                severity: 'success',
                summary: 'Данные о группе удалены',
              });
            }
          });
      },
    });
  }

  openAddDialog() {
    this.isformGroupDialogOpen = true;
  }

  closeFormDialog() {
    this.isformGroupDialogOpen = false;
  }

  onSubmitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { groupName } = this.form.value;
    if (this.isEditing) {
      this.groupService.updateGroup(this.groupIdEdit, groupName!);
      this.updateGroupResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          console.log(responce);
          if (responce === 'success') {
            this.isformGroupDialogOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные о группе обновлены',
            });
          }
        });
    } else {
      this.groupService.createGroup(groupName!);
      this.createGroupResponce$
        .pipe(
          skipWhile((responce) => responce === 'pending'),
          take(1)
        )
        .subscribe((responce) => {
          if (responce === 'success') {
            this.isformGroupDialogOpen = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Данные о группе добавлены',
            });
          }
        });
    }
  }
}
