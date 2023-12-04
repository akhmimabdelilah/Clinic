import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ExtraUserService } from '../service/extra-user.service';

import { ExtraUserComponent } from './extra-user.component';

describe('Component Tests', () => {
  describe('ExtraUser Management Component', () => {
    let comp: ExtraUserComponent;
    let fixture: ComponentFixture<ExtraUserComponent>;
    let service: ExtraUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ExtraUserComponent],
      })
        .overrideTemplate(ExtraUserComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExtraUserComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ExtraUserService);

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
      expect(comp.extraUsers?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
