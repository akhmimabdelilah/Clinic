jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICapteur, Capteur } from '../capteur.model';
import { CapteurService } from '../service/capteur.service';

import { CapteurRoutingResolveService } from './capteur-routing-resolve.service';

describe('Service Tests', () => {
  describe('Capteur routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CapteurRoutingResolveService;
    let service: CapteurService;
    let resultCapteur: ICapteur | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CapteurRoutingResolveService);
      service = TestBed.inject(CapteurService);
      resultCapteur = undefined;
    });

    describe('resolve', () => {
      it('should return ICapteur returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCapteur = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCapteur).toEqual({ id: 123 });
      });

      it('should return new ICapteur if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCapteur = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCapteur).toEqual(new Capteur());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCapteur = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCapteur).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
