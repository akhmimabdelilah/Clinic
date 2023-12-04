import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBoitierCapteur, BoitierCapteur } from '../boitier-capteur.model';
import { BoitierCapteurService } from '../service/boitier-capteur.service';
import { IBoitier } from 'app/entities/boitier/boitier.model';
import { BoitierService } from 'app/entities/boitier/service/boitier.service';
import { ICapteur } from 'app/entities/capteur/capteur.model';
import { CapteurService } from 'app/entities/capteur/service/capteur.service';

@Component({
  selector: 'jhi-boitier-capteur-update',
  templateUrl: './boitier-capteur-update.component.html',
})
export class BoitierCapteurUpdateComponent implements OnInit {
  isSaving = false;

  boitiersSharedCollection: IBoitier[] = [];
  capteursSharedCollection: ICapteur[] = [];

  editForm = this.fb.group({
    id: [],
    branche: [],
    etat: [],
    boitiers: [],
    capteurs: [],
  });

  constructor(
    protected boitierCapteurService: BoitierCapteurService,
    protected boitierService: BoitierService,
    protected capteurService: CapteurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boitierCapteur }) => {
      this.updateForm(boitierCapteur);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const boitierCapteur = this.createFromForm();
    if (boitierCapteur.id !== undefined) {
      this.subscribeToSaveResponse(this.boitierCapteurService.update(boitierCapteur));
    } else {
      this.subscribeToSaveResponse(this.boitierCapteurService.create(boitierCapteur));
    }
  }

  trackBoitierById(index: number, item: IBoitier): number {
    return item.id!;
  }

  trackCapteurById(index: number, item: ICapteur): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBoitierCapteur>>): void {
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

  protected updateForm(boitierCapteur: IBoitierCapteur): void {
    this.editForm.patchValue({
      id: boitierCapteur.id,
      branche: boitierCapteur.branche,
      etat: boitierCapteur.etat,
      boitiers: boitierCapteur.boitiers,
      capteurs: boitierCapteur.capteurs,
    });

    this.boitiersSharedCollection = this.boitierService.addBoitierToCollectionIfMissing(
      this.boitiersSharedCollection,
      boitierCapteur.boitiers
    );
    this.capteursSharedCollection = this.capteurService.addCapteurToCollectionIfMissing(
      this.capteursSharedCollection,
      boitierCapteur.capteurs
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

    this.capteurService
      .query()
      .pipe(map((res: HttpResponse<ICapteur[]>) => res.body ?? []))
      .pipe(
        map((capteurs: ICapteur[]) => this.capteurService.addCapteurToCollectionIfMissing(capteurs, this.editForm.get('capteurs')!.value))
      )
      .subscribe((capteurs: ICapteur[]) => (this.capteursSharedCollection = capteurs));
  }

  protected createFromForm(): IBoitierCapteur {
    return {
      ...new BoitierCapteur(),
      id: this.editForm.get(['id'])!.value,
      branche: this.editForm.get(['branche'])!.value,
      etat: this.editForm.get(['etat'])!.value,
      boitiers: this.editForm.get(['boitiers'])!.value,
      capteurs: this.editForm.get(['capteurs'])!.value,
    };
  }
}
