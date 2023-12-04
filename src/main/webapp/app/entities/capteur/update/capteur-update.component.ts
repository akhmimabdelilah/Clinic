import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICapteur, Capteur } from '../capteur.model';
import { CapteurService } from '../service/capteur.service';

@Component({
  selector: 'jhi-capteur-update',
  templateUrl: './capteur-update.component.html',
})
export class CapteurUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    type: [],
    reference: [],
    resolution: [],
    valeurMin: [],
    valeurMax: [],
  });

  constructor(protected capteurService: CapteurService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ capteur }) => {
      this.updateForm(capteur);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const capteur = this.createFromForm();
    if (capteur.id !== undefined) {
      this.subscribeToSaveResponse(this.capteurService.update(capteur));
    } else {
      this.subscribeToSaveResponse(this.capteurService.create(capteur));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICapteur>>): void {
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

  protected updateForm(capteur: ICapteur): void {
    this.editForm.patchValue({
      id: capteur.id,
      type: capteur.type,
      reference: capteur.reference,
      resolution: capteur.resolution,
      valeurMin: capteur.valeurMin,
      valeurMax: capteur.valeurMax,
    });
  }

  protected createFromForm(): ICapteur {
    return {
      ...new Capteur(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      resolution: this.editForm.get(['resolution'])!.value,
      valeurMin: this.editForm.get(['valeurMin'])!.value,
      valeurMax: this.editForm.get(['valeurMax'])!.value,
    };
  }
}
