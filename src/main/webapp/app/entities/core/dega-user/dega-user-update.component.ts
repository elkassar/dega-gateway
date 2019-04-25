import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IDegaUser } from 'app/shared/model/core/dega-user.model';
import { DegaUserService } from './dega-user.service';
import { IRole } from 'app/shared/model/core/role.model';
import { RoleService } from 'app/entities/core/role';
import { IOrganization } from 'app/shared/model/core/organization.model';
import { OrganizationService } from 'app/entities/core/organization';
import { IPost } from 'app/shared/model/core/post.model';
import { PostService } from 'app/entities/core/post';
import { MediaService } from '../media/media.service';
import { Subscription } from 'rxjs';
import { IRoleMapping } from 'app/shared/model/core/role-mapping.model';
import { RoleMappingService } from 'app/entities/core/role-mapping';

@Component({
    selector: 'jhi-dega-user-update',
    templateUrl: './dega-user-update.component.html'
})
export class DegaUserUpdateComponent implements OnInit {
    degaUser: IDegaUser;
    isSaving: boolean;

    roles: IRole[];

    organizations: IOrganization[];

    posts: IPost[];

    rolemappings: IRoleMapping[];
    createdDate: string;
    slug: string;
    slugExtention: number;
    tempSlug: string;
    subscription: Subscription;

    backend_compatible_role_mapping_list = [];
    all_role_mapping_options = [];
    selected_role_mapping_options = [];

    backend_compatible_organization_list = [];
    all_organization_options = [];
    selected_organization_options = [];

    constructor(
        private jhiAlertService: JhiAlertService,
        private degaUserService: DegaUserService,
        private roleService: RoleService,
        private organizationService: OrganizationService,
        private postService: PostService,
        private roleMappingService: RoleMappingService,
        private activatedRoute: ActivatedRoute,
        private mediaService: MediaService
    ) {
        this.subscription = this.mediaService.getProductID().subscribe(message => {
            if (message['type_of_data'] === 'feature') {
                this.updateMediaForFeature(message['selected_url']);
            }
        });
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ degaUser }) => {
            this.degaUser = degaUser;
            this.selected_role_mapping_options = this.processOptionToDesireCheckboxFormat(this.degaUser.roleMappings, 'name');
            this.selected_organization_options = this.processOptionToDesireCheckboxFormat(this.degaUser.organizations, 'name');
            this.createdDate = this.degaUser.createdDate != null ? this.degaUser.createdDate.format(DATE_TIME_FORMAT) : null;
        });
        this.roleService.query().subscribe(
            (res: HttpResponse<IRole[]>) => {
                this.roles = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.organizationService.query().subscribe(
            (res: HttpResponse<IOrganization[]>) => {
                this.organizations = res.body;
                this.backend_compatible_organization_list = res.body;
                this.all_organization_options = this.processOptionToDesireCheckboxFormat(this.backend_compatible_organization_list, 'name');
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.postService.query().subscribe(
            (res: HttpResponse<IPost[]>) => {
                this.posts = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.roleMappingService.query().subscribe(
            (res: HttpResponse<IRoleMapping[]>) => {
                this.rolemappings = res.body;
                this.backend_compatible_role_mapping_list = res.body;
                this.all_role_mapping_options = this.processOptionToDesireCheckboxFormat(this.backend_compatible_role_mapping_list, 'name');
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.degaUser.createdDate = this.createdDate != null ? moment(this.createdDate, DATE_TIME_FORMAT) : null;
        if (this.degaUser.id !== undefined) {
            this.subscribeToSaveResponse(this.degaUserService.update(this.degaUser));
        } else {
            this.subscribeToSaveResponse(this.degaUserService.create(this.degaUser));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IDegaUser>>) {
        result.subscribe((res: HttpResponse<IDegaUser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackRoleById(index: number, item: IRole) {
        return item.id;
    }

    trackOrganizationById(index: number, item: IOrganization) {
        return item.id;
    }

    trackPostById(index: number, item: IPost) {
        return item.id;
    }

    trackRoleMappingById(index: number, item: IRoleMapping) {
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

    updateMediaForFeature(url) {
        this.degaUser.profilePicture = url;
    }

    // Think about optimising this code block, move it to a service, Starts here
    processOptionToDesireCheckboxFormat(option_list, key_name) {
        const formatted_option_list = [];
        for (const option_details of option_list) {
            const option_format = {};
            option_format['id'] = option_details['id'];
            option_format['display_text'] = option_details[key_name];
            formatted_option_list.push(option_format);
        }
        return formatted_option_list;
    }

    processOrganizationsToBackendRequiredFormat(claim_list) {
        const formatted_claim_list = [];
        for (const claim_details of claim_list) {
            formatted_claim_list.push(this.backend_compatible_organization_list.filter(obj => obj['id'] === claim_details['id'])[0]);
        }
        return formatted_claim_list;
    }

    processRoleMappingToBackendRequiredFormat(tag_list) {
        const formatted_tag_list = [];
        for (const tag_details of tag_list) {
            formatted_tag_list.push(this.backend_compatible_role_mapping_list.filter(obj => obj['id'] === tag_details['id'])[0]);
        }
        return formatted_tag_list;
    }

    // Think about optimising this code block, move it to a service, Ends here

    update_organization_selection(val) {
        this.degaUser.organizations = this.processOrganizationsToBackendRequiredFormat(val);
    }

    update_role_mapping_selection(val) {
        this.degaUser.roleMappings = this.processRoleMappingToBackendRequiredFormat(val);
    }
}
