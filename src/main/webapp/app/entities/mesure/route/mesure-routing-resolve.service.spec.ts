jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMesure, Mesure } from '../mesure.model';
import { MesureService } from '../service/mesure.service';

import { MesureRoutingResolveService } from './mesure-routing-resolve.service';

describe('Service Tests', () => {
  describe('Mesure routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MesureRoutingResolveService;
    let service: MesureService;
    let resultMesure: IMesure | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MesureRoutingResolveService);
      service = TestBed.inject(MesureService);
      resultMesure = undefined;
    });

    describe('resolve', () => {
      it('should return IMesure returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMesure = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMesure).toEqual({ id: 123 });
      });

      it('should return new IMesure if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMesure = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMesure).toEqual(new Mesure());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMesure = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMesure).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
