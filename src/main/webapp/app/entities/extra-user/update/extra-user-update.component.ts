import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IExtraUser, ExtraUser } from '../extra-user.model';
import { ExtraUserService } from '../service/extra-user.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-extra-user-update',
  templateUrl: './extra-user-update.component.html',
})
export class ExtraUserUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    cin: [],
    numeroTelephone: [],
    dateNaissance: [],
    nationalite: [],
    adresse: [],
    genre: [],
    user: [],
  });

  constructor(
    protected extraUserService: ExtraUserService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ extraUser }) => {
      this.updateForm(extraUser);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const extraUser = this.createFromForm();
    if (extraUser.id !== undefined) {
      this.subscribeToSaveResponse(this.extraUserService.update(extraUser));
    } else {
      this.subscribeToSaveResponse(this.extraUserService.create(extraUser));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExtraUser>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(extraUser: IExtraUser): void {
    this.editForm.patchValue({
      id: extraUser.id,
      cin: extraUser.cin,
      numeroTelephone: extraUser.numeroTelephone,
      dateNaissance: extraUser.dateNaissance,
      nationalite: extraUser.nationalite,
      adresse: extraUser.adresse,
      genre: extraUser.genre,
      user: extraUser.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, extraUser.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IExtraUser {
    return {
      ...new ExtraUser(),
      id: this.editForm.get(['id'])!.value,
      cin: this.editForm.get(['cin'])!.value,
      numeroTelephone: this.editForm.get(['numeroTelephone'])!.value,
      dateNaissance: this.editForm.get(['dateNaissance'])!.value,
      nationalite: this.editForm.get(['nationalite'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      genre: this.editForm.get(['genre'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
