import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IOrganization } from 'app/shared/model/core/organization.model';
import { OrganizationService } from './organization.service';
import { IDegaUser } from 'app/shared/model/core/dega-user.model';
import { DegaUserService } from 'app/entities/core/dega-user';
import { MediaService } from '../media/media.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'jhi-organization-update',
    templateUrl: './organization-update.component.html'
})
export class OrganizationUpdateComponent implements OnInit {
    organization: IOrganization;
    isSaving: boolean;

    degausers: IDegaUser[];
    createdDate: string;
    lastUpdatedDate: string;
    slug: string;
    slugExtention: number;
    tempSlug: string;
    subscription: Subscription;

    constructor(
        private jhiAlertService: JhiAlertService,
        private organizationService: OrganizationService,
        private degaUserService: DegaUserService,
        private activatedRoute: ActivatedRoute,
        private mediaService: MediaService,
        private router: Router
    ) {
        this.subscription = this.mediaService.getProductID().subscribe(message => {
            if (message['type_of_data'] === 'logoURL') {
                this.updateMediaForLogoURL(message['selected_url']);
            }
            if (message['type_of_data'] === 'logoURLMobile') {
                this.updateMediaForLogoURLMobile(message['selected_url']);
            }
            if (message['type_of_data'] === 'favIconURL') {
                this.updateMediaForFavIconURL(message['selected_url']);
            }
            if (message['type_of_data'] === 'mobileIconURL') {
                this.updateMediaForMobileIconURLMobile(message['selected_url']);
            }
        });
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ organization }) => {
            this.organization = organization;
            this.createdDate = this.organization.createdDate != null ? this.organization.createdDate.format(DATE_TIME_FORMAT) : null;
            this.lastUpdatedDate =
                this.organization.lastUpdatedDate != null ? this.organization.lastUpdatedDate.format(DATE_TIME_FORMAT) : null;
        });
        this.degaUserService.query().subscribe(
            (res: HttpResponse<IDegaUser[]>) => {
                this.degausers = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.organization.createdDate = this.createdDate != null ? moment(this.createdDate, DATE_TIME_FORMAT) : null;
        this.organization.lastUpdatedDate = this.lastUpdatedDate != null ? moment(this.lastUpdatedDate, DATE_TIME_FORMAT) : null;
        if (this.organization.id !== undefined) {
            this.subscribeToSaveResponse(this.organizationService.update(this.organization));
        } else {
            this.subscribeToSaveResponse(this.organizationService.create(this.organization));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IOrganization>>) {
        result.subscribe((res: HttpResponse<IOrganization>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackDegaUserById(index: number, item: IDegaUser) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }

    removeImage(imageUrl) {
        if (imageUrl === 'logoURL') {
            this.organization.logoURL = '';
        } else if (imageUrl === 'logoURLMobile') {
            this.organization.logoURLMobile = '';
        } else if (imageUrl === 'favIconURL') {
            this.organization.favIconURL = '';
        } else {
            this.organization.mobileIconURL = '';
        }
    }

    updateMediaForLogoURL(url) {
        this.organization.logoURL = url;
    }
    updateMediaForLogoURLMobile(url) {
        this.organization.logoURLMobile = url;
    }
    updateMediaForFavIconURL(url) {
        this.organization.favIconURL = url;
    }
    updateMediaForMobileIconURLMobile(url) {
        this.organization.mobileIconURL = url;
    }
}
