import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CapteurService } from '../service/capteur.service';

import { CapteurComponent } from './capteur.component';

describe('Component Tests', () => {
  describe('Capteur Management Component', () => {
    let comp: CapteurComponent;
    let fixture: ComponentFixture<CapteurComponent>;
    let service: CapteurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CapteurComponent],
      })
        .overrideTemplate(CapteurComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CapteurComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CapteurService);

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
      expect(comp.capteurs?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
