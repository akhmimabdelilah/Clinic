import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMedecin, Medecin } from '../medecin.model';
import { MedecinService } from '../service/medecin.service';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';

@Component({
  selector: 'jhi-medecin-update',
  templateUrl: './medecin-update.component.html',
})
export class MedecinUpdateComponent implements OnInit {
  isSaving = false;

  extraUserIdsCollection: IExtraUser[] = [];

  editForm = this.fb.group({
    id: [],
    specialite: [],
    extraUserId: [],
  });

  constructor(
    protected medecinService: MedecinService,
    protected extraUserService: ExtraUserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medecin }) => {
      this.updateForm(medecin);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medecin = this.createFromForm();
    if (medecin.id !== undefined) {
      this.subscribeToSaveResponse(this.medecinService.update(medecin));
    } else {
      this.subscribeToSaveResponse(this.medecinService.create(medecin));
    }
  }

  trackExtraUserById(index: number, item: IExtraUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedecin>>): void {
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

  protected updateForm(medecin: IMedecin): void {
    this.editForm.patchValue({
      id: medecin.id,
      specialite: medecin.specialite,
      extraUserId: medecin.extraUserId,
    });

    this.extraUserIdsCollection = this.extraUserService.addExtraUserToCollectionIfMissing(this.extraUserIdsCollection, medecin.extraUserId);
  }

  protected loadRelationshipsOptions(): void {
    this.extraUserService
      .query({ filter: 'medecin-is-null' })
      .pipe(map((res: HttpResponse<IExtraUser[]>) => res.body ?? []))
      .pipe(
        map((extraUsers: IExtraUser[]) =>
          this.extraUserService.addExtraUserToCollectionIfMissing(extraUsers, this.editForm.get('extraUserId')!.value)
        )
      )
      .subscribe((extraUsers: IExtraUser[]) => (this.extraUserIdsCollection = extraUsers));
  }

  protected createFromForm(): IMedecin {
    return {
      ...new Medecin(),
      id: this.editForm.get(['id'])!.value,
      specialite: this.editForm.get(['specialite'])!.value,
      extraUserId: this.editForm.get(['extraUserId'])!.value,
    };
  }
}
