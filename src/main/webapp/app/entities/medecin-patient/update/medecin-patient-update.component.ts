import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMedecinPatient, MedecinPatient } from '../medecin-patient.model';
import { MedecinPatientService } from '../service/medecin-patient.service';
import { IMedecin } from 'app/entities/medecin/medecin.model';
import { MedecinService } from 'app/entities/medecin/service/medecin.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

@Component({
  selector: 'jhi-medecin-patient-update',
  templateUrl: './medecin-patient-update.component.html',
})
export class MedecinPatientUpdateComponent implements OnInit {
  isSaving = false;

  medecinsSharedCollection: IMedecin[] = [];
  patientsSharedCollection: IPatient[] = [];

  editForm = this.fb.group({
    id: [],
    dateDebut: [],
    dateFin: [],
    medecins: [],
    patients: [],
  });

  constructor(
    protected medecinPatientService: MedecinPatientService,
    protected medecinService: MedecinService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medecinPatient }) => {
      this.updateForm(medecinPatient);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medecinPatient = this.createFromForm();
    if (medecinPatient.id !== undefined) {
      this.subscribeToSaveResponse(this.medecinPatientService.update(medecinPatient));
    } else {
      this.subscribeToSaveResponse(this.medecinPatientService.create(medecinPatient));
    }
  }

  trackMedecinById(index: number, item: IMedecin): number {
    return item.id!;
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedecinPatient>>): void {
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

  protected updateForm(medecinPatient: IMedecinPatient): void {
    this.editForm.patchValue({
      id: medecinPatient.id,
      dateDebut: medecinPatient.dateDebut,
      dateFin: medecinPatient.dateFin,
      medecins: medecinPatient.medecins,
      patients: medecinPatient.patients,
    });

    this.medecinsSharedCollection = this.medecinService.addMedecinToCollectionIfMissing(
      this.medecinsSharedCollection,
      medecinPatient.medecins
    );
    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing(
      this.patientsSharedCollection,
      medecinPatient.patients
    );
  }

  protected loadRelationshipsOptions(): void {
    this.medecinService
      .query()
      .pipe(map((res: HttpResponse<IMedecin[]>) => res.body ?? []))
      .pipe(
        map((medecins: IMedecin[]) => this.medecinService.addMedecinToCollectionIfMissing(medecins, this.editForm.get('medecins')!.value))
      )
      .subscribe((medecins: IMedecin[]) => (this.medecinsSharedCollection = medecins));

    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing(patients, this.editForm.get('patients')!.value))
      )
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));
  }

  protected createFromForm(): IMedecinPatient {
    return {
      ...new MedecinPatient(),
      id: this.editForm.get(['id'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value,
      dateFin: this.editForm.get(['dateFin'])!.value,
      medecins: this.editForm.get(['medecins'])!.value,
      patients: this.editForm.get(['patients'])!.value,
    };
  }
}
