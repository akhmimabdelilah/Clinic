import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBoitierCapteur } from '../boitier-capteur.model';
import { BoitierCapteurService } from '../service/boitier-capteur.service';
import { BoitierCapteurDeleteDialogComponent } from '../delete/boitier-capteur-delete-dialog.component';

@Component({
  selector: 'jhi-boitier-capteur',
  templateUrl: './boitier-capteur.component.html',
})
export class BoitierCapteurComponent implements OnInit {
  boitierCapteurs?: IBoitierCapteur[];
  isLoading = false;

  constructor(protected boitierCapteurService: BoitierCapteurService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.boitierCapteurService.query().subscribe(
      (res: HttpResponse<IBoitierCapteur[]>) => {
        this.isLoading = false;
        this.boitierCapteurs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBoitierCapteur): number {
    return item.id!;
  }

  delete(boitierCapteur: IBoitierCapteur): void {
    const modalRef = this.modalService.open(BoitierCapteurDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.boitierCapteur = boitierCapteur;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
