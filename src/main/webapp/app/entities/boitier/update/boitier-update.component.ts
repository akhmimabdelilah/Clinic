import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBoitier, Boitier } from '../boitier.model';
import { BoitierService } from '../service/boitier.service';

@Component({
  selector: 'jhi-boitier-update',
  templateUrl: './boitier-update.component.html',
})
export class BoitierUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    type: [],
    ref: [],
    nbrBranche: [],
  });

  constructor(protected boitierService: BoitierService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boitier }) => {
      this.updateForm(boitier);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const boitier = this.createFromForm();
    if (boitier.id !== undefined) {
      this.subscribeToSaveResponse(this.boitierService.update(boitier));
    } else {
      this.subscribeToSaveResponse(this.boitierService.create(boitier));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBoitier>>): void {
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

  protected updateForm(boitier: IBoitier): void {
    this.editForm.patchValue({
      id: boitier.id,
      type: boitier.type,
      ref: boitier.ref,
      nbrBranche: boitier.nbrBranche,
    });
  }

  protected createFromForm(): IBoitier {
    return {
      ...new Boitier(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      ref: this.editForm.get(['ref'])!.value,
      nbrBranche: this.editForm.get(['nbrBranche'])!.value,
    };
  }
}
