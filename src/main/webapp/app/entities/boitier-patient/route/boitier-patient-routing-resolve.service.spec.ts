jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBoitierPatient, BoitierPatient } from '../boitier-patient.model';
import { BoitierPatientService } from '../service/boitier-patient.service';

import { BoitierPatientRoutingResolveService } from './boitier-patient-routing-resolve.service';

describe('Service Tests', () => {
  describe('BoitierPatient routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BoitierPatientRoutingResolveService;
    let service: BoitierPatientService;
    let resultBoitierPatient: IBoitierPatient | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BoitierPatientRoutingResolveService);
      service = TestBed.inject(BoitierPatientService);
      resultBoitierPatient = undefined;
    });

    describe('resolve', () => {
      it('should return IBoitierPatient returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBoitierPatient = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBoitierPatient).toEqual({ id: 123 });
      });

      it('should return new IBoitierPatient if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBoitierPatient = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBoitierPatient).toEqual(new BoitierPatient());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBoitierPatient = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBoitierPatient).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
