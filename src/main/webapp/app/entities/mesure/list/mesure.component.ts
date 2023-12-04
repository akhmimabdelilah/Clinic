import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMesure } from '../mesure.model';
import { MesureService } from '../service/mesure.service';
import { MesureDeleteDialogComponent } from '../delete/mesure-delete-dialog.component';

@Component({
  selector: 'jhi-mesure',
  templateUrl: './mesure.component.html',
})
export class MesureComponent implements OnInit {
  mesures?: IMesure[];
  isLoading = false;

  constructor(protected mesureService: MesureService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.mesureService.query().subscribe(
      (res: HttpResponse<IMesure[]>) => {
        this.isLoading = false;
        this.mesures = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMesure): number {
    return item.id!;
  }

  delete(mesure: IMesure): void {
    const modalRef = this.modalService.open(MesureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.mesure = mesure;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
