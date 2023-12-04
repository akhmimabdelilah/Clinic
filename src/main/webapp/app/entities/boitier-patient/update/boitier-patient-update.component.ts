import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBoitierPatient, BoitierPatient } from '../boitier-patient.model';
import { BoitierPatientService } from '../service/boitier-patient.service';
import { IBoitier } from 'app/entities/boitier/boitier.model';
import { BoitierService } from 'app/entities/boitier/service/boitier.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

@Component({
  selector: 'jhi-boitier-patient-update',
  templateUrl: './boitier-patient-update.component.html',
})
export class BoitierPatientUpdateComponent implements OnInit {
  isSaving = false;

  boitiersSharedCollection: IBoitier[] = [];
  patientsSharedCollection: IPatient[] = [];

  editForm = this.fb.group({
    id: [],
    dateDebut: [],
    dateFin: [],
    boitiers: [],
    patients: [],
  });

  constructor(
    protected boitierPatientService: BoitierPatientService,
    protected boitierService: BoitierService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boitierPatient }) => {
      this.updateForm(boitierPatient);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const boitierPatient = this.createFromForm();
    if (boitierPatient.id !== undefined) {
      this.subscribeToSaveResponse(this.boitierPatientService.update(boitierPatient));
    } else {
      this.subscribeToSaveResponse(this.boitierPatientService.create(boitierPatient));
    }
  }

  trackBoitierById(index: number, item: IBoitier): number {
    return item.id!;
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBoitierPatient>>): void {
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

  protected updateForm(boitierPatient: IBoitierPatient): void {
    this.editForm.patchValue({
      id: boitierPatient.id,
      dateDebut: boitierPatient.dateDebut,
      dateFin: boitierPatient.dateFin,
      boitiers: boitierPatient.boitiers,
      patients: boitierPatient.patients,
    });

    this.boitiersSharedCollection = this.boitierService.addBoitierToCollectionIfMissing(
      this.boitiersSharedCollection,
      boitierPatient.boitiers
    );
    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing(
      this.patientsSharedCollection,
      boitierPatient.patients
    );
  }

  protected loadRelationshipsOptions(): void {
    this.boitierService
      .query()
      .pipe(map((res: HttpResponse<IBoitier[]>) => res.body ?? []))
      .pipe(
        map((boitiers: IBoitier[]) => this.boitierService.addBoitierToCollectionIfMissing(boitiers, this.editForm.get('boitiers')!.value))
      )
      .subscribe((boitiers: IBoitier[]) => (this.boitiersSharedCollection = boitiers));

    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing(patients, this.editForm.get('patients')!.value))
      )
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));
  }

  protected createFromForm(): IBoitierPatient {
    return {
      ...new BoitierPatient(),
      id: this.editForm.get(['id'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value,
      dateFin: this.editForm.get(['dateFin'])!.value,
      boitiers: this.editForm.get(['boitiers'])!.value,
      patients: this.editForm.get(['patients'])!.value,
    };
  }
}
