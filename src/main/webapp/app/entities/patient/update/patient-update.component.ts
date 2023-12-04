import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPatient, Patient } from '../patient.model';
import { PatientService } from '../service/patient.service';
import { IExtraUser } from 'app/entities/extra-user/extra-user.model';
import { ExtraUserService } from 'app/entities/extra-user/service/extra-user.service';

@Component({
  selector: 'jhi-patient-update',
  templateUrl: './patient-update.component.html',
})
export class PatientUpdateComponent implements OnInit {
  isSaving = false;

  extraUserIdsCollection: IExtraUser[] = [];

  editForm = this.fb.group({
    id: [],
    profession: [],
    extraUserId: [],
  });

  constructor(
    protected patientService: PatientService,
    protected extraUserService: ExtraUserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      this.updateForm(patient);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const patient = this.createFromForm();
    if (patient.id !== undefined) {
      this.subscribeToSaveResponse(this.patientService.update(patient));
    } else {
      this.subscribeToSaveResponse(this.patientService.create(patient));
    }
  }

  trackExtraUserById(index: number, item: IExtraUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatient>>): void {
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

  protected updateForm(patient: IPatient): void {
    this.editForm.patchValue({
      id: patient.id,
      profession: patient.profession,
      extraUserId: patient.extraUserId,
    });

    this.extraUserIdsCollection = this.extraUserService.addExtraUserToCollectionIfMissing(this.extraUserIdsCollection, patient.extraUserId);
  }

  protected loadRelationshipsOptions(): void {
    this.extraUserService
      .query({ filter: 'patient-is-null' })
      .pipe(map((res: HttpResponse<IExtraUser[]>) => res.body ?? []))
      .pipe(
        map((extraUsers: IExtraUser[]) =>
          this.extraUserService.addExtraUserToCollectionIfMissing(extraUsers, this.editForm.get('extraUserId')!.value)
        )
      )
      .subscribe((extraUsers: IExtraUser[]) => (this.extraUserIdsCollection = extraUsers));
  }

  protected createFromForm(): IPatient {
    return {
      ...new Patient(),
      id: this.editForm.get(['id'])!.value,
      profession: this.editForm.get(['profession'])!.value,
      extraUserId: this.editForm.get(['extraUserId'])!.value,
    };
  }
}
