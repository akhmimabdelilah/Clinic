import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICapteur } from '../capteur.model';
import { CapteurService } from '../service/capteur.service';
import { CapteurDeleteDialogComponent } from '../delete/capteur-delete-dialog.component';

@Component({
  selector: 'jhi-capteur',
  templateUrl: './capteur.component.html',
})
export class CapteurComponent implements OnInit {
  capteurs?: ICapteur[];
  isLoading = false;

  constructor(protected capteurService: CapteurService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.capteurService.query().subscribe(
      (res: HttpResponse<ICapteur[]>) => {
        this.isLoading = false;
        this.capteurs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICapteur): number {
    return item.id!;
  }

  delete(capteur: ICapteur): void {
    const modalRef = this.modalService.open(CapteurDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.capteur = capteur;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
