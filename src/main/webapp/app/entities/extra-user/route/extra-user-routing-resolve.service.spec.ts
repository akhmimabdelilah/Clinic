jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IExtraUser, ExtraUser } from '../extra-user.model';
import { ExtraUserService } from '../service/extra-user.service';

import { ExtraUserRoutingResolveService } from './extra-user-routing-resolve.service';

describe('Service Tests', () => {
  describe('ExtraUser routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ExtraUserRoutingResolveService;
    let service: ExtraUserService;
    let resultExtraUser: IExtraUser | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ExtraUserRoutingResolveService);
      service = TestBed.inject(ExtraUserService);
      resultExtraUser = undefined;
    });

    describe('resolve', () => {
      it('should return IExtraUser returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExtraUser = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultExtraUser).toEqual({ id: 123 });
      });

      it('should return new IExtraUser if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExtraUser = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultExtraUser).toEqual(new ExtraUser());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExtraUser = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultExtraUser).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
