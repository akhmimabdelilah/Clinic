import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BoitierService } from '../service/boitier.service';

import { BoitierComponent } from './boitier.component';

describe('Component Tests', () => {
  describe('Boitier Management Component', () => {
    let comp: BoitierComponent;
    let fixture: ComponentFixture<BoitierComponent>;
    let service: BoitierService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BoitierComponent],
      })
        .overrideTemplate(BoitierComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BoitierComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BoitierService);

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
      expect(comp.boitiers?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
