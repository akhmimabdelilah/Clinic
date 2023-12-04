import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMesure, Mesure } from '../mesure.model';
import { MesureService } from '../service/mesure.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

@Component({
  selector: 'jhi-mesure-update',
  templateUrl: './mesure-update.component.html',
})
export class MesureUpdateComponent implements OnInit {
  isSaving = false;

  patientsSharedCollection: IPatient[] = [];

  editForm = this.fb.group({
    id: [],
    type: [],
    valeur: [],
    date: [],
    patient: [],
  });

  constructor(
    protected mesureService: MesureService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mesure }) => {
      this.updateForm(mesure);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mesure = this.createFromForm();
    if (mesure.id !== undefined) {
      this.subscribeToSaveResponse(this.mesureService.update(mesure));
    } else {
      this.subscribeToSaveResponse(this.mesureService.create(mesure));
    }
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMesure>>): void {
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

  protected updateForm(mesure: IMesure): void {
    this.editForm.patchValue({
      id: mesure.id,
      type: mesure.type,
      valeur: mesure.valeur,
      date: mesure.date,
      patient: mesure.patient,
    });

    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing(this.patientsSharedCollection, mesure.patient);
  }

  protected loadRelationshipsOptions(): void {
    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing(patients, this.editForm.get('patient')!.value))
      )
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));
  }

  protected createFromForm(): IMesure {
    return {
      ...new Mesure(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      valeur: this.editForm.get(['valeur'])!.value,
      date: this.editForm.get(['date'])!.value,
      patient: this.editForm.get(['patient'])!.value,
    };
  }
}
