/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { ClaimDetailComponent } from 'app/entities/factcheck/claim/claim-detail.component';
import { Claim } from 'app/shared/model/factcheck/claim.model';

describe('Component Tests', () => {
    describe('Claim Management Detail Component', () => {
        let comp: ClaimDetailComponent;
        let fixture: ComponentFixture<ClaimDetailComponent>;
        const route = ({ data: of({ claim: new Claim('123') }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [ClaimDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ClaimDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ClaimDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.claim).toEqual(jasmine.objectContaining({ id: '123' }));
            });
        });
    });
});
