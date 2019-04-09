import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IClaimant } from 'app/shared/model/factcheck/claimant.model';
import { ClaimantService } from './claimant.service';
import { MediaService } from '../../core/media/media.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'jhi-claimant-update',
    templateUrl: './claimant-update.component.html'
})
export class ClaimantUpdateComponent implements OnInit {
    claimant: IClaimant;
    isSaving: boolean;
    createdDate: string;
    lastUpdatedDate: string;
    slug: string;
    slugExtention: number;
    tempSlug: string;
    subscription: Subscription;

    constructor(
        private claimantService: ClaimantService,
        private activatedRoute: ActivatedRoute,
        private mediaService: MediaService,
        private router: Router
    ) {
        this.subscription = this.mediaService.getProductID().subscribe(message => {
            if (message['type_of_data'] === 'feature') {
                this.updateMediaForFeature(message['selected_url']);
            }
        });
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ claimant }) => {
            this.claimant = claimant;
            this.createdDate = this.claimant.createdDate != null ? this.claimant.createdDate.format(DATE_TIME_FORMAT) : null;
            this.lastUpdatedDate = this.claimant.lastUpdatedDate != null ? this.claimant.lastUpdatedDate.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.claimant.createdDate = this.createdDate != null ? moment(this.createdDate, DATE_TIME_FORMAT) : null;
        this.claimant.lastUpdatedDate = this.lastUpdatedDate != null ? moment(this.lastUpdatedDate, DATE_TIME_FORMAT) : null;
        if (this.claimant.id !== undefined) {
            this.subscribeToSaveResponse(this.claimantService.update(this.claimant));
        } else {
            this.subscribeToSaveResponse(this.claimantService.create(this.claimant));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IClaimant>>) {
        result.subscribe((res: HttpResponse<IClaimant>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    updateMediaForFeature(url) {
        this.claimant.imageURL = url;
    }
}
