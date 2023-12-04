import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MesureService } from '../service/mesure.service';

import { MesureComponent } from './mesure.component';

describe('Component Tests', () => {
  describe('Mesure Management Component', () => {
    let comp: MesureComponent;
    let fixture: ComponentFixture<MesureComponent>;
    let service: MesureService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MesureComponent],
      })
        .overrideTemplate(MesureComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MesureComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MesureService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.mesures?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
