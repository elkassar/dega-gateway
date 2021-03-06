import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { AUTHOR_ROLE, PUBLISHER_ROLE } from 'app/shared/constants/role.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IPost } from 'app/shared/model/core/post.model';
import { PostService } from './post.service';
import { ITag } from 'app/shared/model/core/tag.model';
import { TagService } from 'app/entities/core/tag';
import { ICategory } from 'app/shared/model/core/category.model';
import { CategoryService } from 'app/entities/core/category';
import { IStatus } from 'app/shared/model/core/status.model';
import { StatusService } from 'app/entities/core/status';
import { IFormat } from 'app/shared/model/core/format.model';
import { FormatService } from 'app/entities/core/format';
import { IDegaUser } from 'app/shared/model/core/dega-user.model';
import { DegaUserService } from 'app/entities/core/dega-user';
import { Account, Principal } from 'app/core';

@Component({
    selector: 'jhi-post-update',
    templateUrl: './post-update.component.html'
})
export class PostUpdateComponent implements OnInit {
    post: IPost;
    isSaving: boolean;

    tags: ITag[];

    categories: ICategory[];

    statuses: IStatus[];

    formats: IFormat[];

    degausers: IDegaUser[];
    currentUser: IDegaUser;
    publishedDate: string;
    lastUpdatedDate: string;
    createdDate: string;
    showSave: boolean;
    showPublish: boolean;
    slug: string;
    slugExtention: number;
    tempSlug: string;
    account: Account;

    backend_compatible_author_list = [];
    all_author_options = [];
    selected_author_options = [];

    backend_compatible_tag_list = [];
    all_tag_options = [];
    selected_tag_options = [];

    backend_compatible_category_list = [];
    all_category_options = [];
    selected_category_options = [];

    constructor(
        private jhiAlertService: JhiAlertService,
        private postService: PostService,
        private tagService: TagService,
        private categoryService: CategoryService,
        private statusService: StatusService,
        private formatService: FormatService,
        private degaUserService: DegaUserService,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ post }) => {
            this.post = post;
            this.selected_tag_options = this.processOptionToDesireCheckboxFormat(this.post.tags, 'name');
            this.selected_category_options = this.processOptionToDesireCheckboxFormat(this.post.categories, 'name');
            this.selected_author_options = this.processOptionToDesireCheckboxFormat(this.post.degaUsers, 'displayName');
            this.publishedDate = this.post.publishedDate != null ? this.post.publishedDate.format(DATE_TIME_FORMAT) : null;
            this.lastUpdatedDate = this.post.lastUpdatedDate != null ? this.post.lastUpdatedDate.format(DATE_TIME_FORMAT) : null;
            this.createdDate = this.post.createdDate != null ? this.post.createdDate.format(DATE_TIME_FORMAT) : null;
        });
        this.tagService.query().subscribe(
            (res: HttpResponse<ITag[]>) => {
                this.tags = res.body;
                this.backend_compatible_tag_list = res.body;
                this.all_tag_options = this.processOptionToDesireCheckboxFormat(this.backend_compatible_tag_list, 'name');
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.categoryService.query().subscribe(
            (res: HttpResponse<ICategory[]>) => {
                this.categories = res.body;
                this.backend_compatible_category_list = res.body;
                this.all_category_options = this.processOptionToDesireCheckboxFormat(this.backend_compatible_category_list, 'name');
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.statusService.query().subscribe(
            (res: HttpResponse<IStatus[]>) => {
                this.statuses = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.formatService.query().subscribe(
            (res: HttpResponse<IFormat[]>) => {
                this.formats = res.body;
                if (this.post.id === undefined) {
                    this.post.formatId = this.formats.find(format => format.name === 'Standard').id;
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.degaUserService.query().subscribe(
            (res: HttpResponse<IDegaUser[]>) => {
                this.degausers = res.body;
                this.backend_compatible_author_list = res.body;
                this.all_author_options = this.processOptionToDesireCheckboxFormat(this.backend_compatible_author_list, 'displayName');
                this.currentUser = this.degausers
                    .filter(u => {
                        const found = u.email === this.account.email;
                        return found;
                    })
                    .shift();
                this.showSave = this.showSaveButton(this.currentUser.roleName);
                this.showPublish = this.showPublishButton(this.currentUser.roleName);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    updatePostContentFormData(data) {
        this.post.content = data['html'];
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.post.publishedDate = this.publishedDate != null ? moment(this.publishedDate, DATE_TIME_FORMAT) : null;
        this.post.lastUpdatedDate = this.lastUpdatedDate != null ? moment(this.lastUpdatedDate, DATE_TIME_FORMAT) : null;
        this.post.createdDate = this.createdDate != null ? moment(this.createdDate, DATE_TIME_FORMAT) : null;
        if (this.post.id !== undefined) {
            this.post.statusName = 'Draft';
            this.subscribeToSaveResponse(this.postService.update(this.post));
        } else {
            this.subscribeToSaveResponse(this.postService.create(this.post));
        }
    }

    publish() {
        this.isSaving = true;
        this.post.publishedDate = this.publishedDate != null ? moment(this.publishedDate, DATE_TIME_FORMAT) : null;
        this.post.lastUpdatedDate = this.lastUpdatedDate != null ? moment(this.lastUpdatedDate, DATE_TIME_FORMAT) : null;
        if (this.post.id !== undefined) {
            this.post.statusName = 'Publish';
            this.subscribeToSaveResponse(this.postService.update(this.post));
        } else {
            this.subscribeToSaveResponse(this.postService.publish(this.post));
        }
    }

    showSaveButton(degausersRole: String): boolean {
        return AUTHOR_ROLE.includes(degausersRole);
    }

    showPublishButton(degausersRole: String): boolean {
        return PUBLISHER_ROLE.includes(degausersRole);
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>) {
        result.subscribe((res: HttpResponse<IPost>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackTagById(index: number, item: ITag) {
        return item.id;
    }

    trackCategoryById(index: number, item: ICategory) {
        return item.id;
    }

    trackStatusById(index: number, item: IStatus) {
        return item.id;
    }

    trackFormatById(index: number, item: IFormat) {
        return item.id;
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

    processTagToBackendRequiredFormat(tag_list) {
        const formatted_tag_list = [];
        for (const tag_details of tag_list) {
            formatted_tag_list.push(this.backend_compatible_tag_list.filter(obj => obj['id'] === tag_details['id'])[0]);
        }
        return formatted_tag_list;
    }

    processAuthorToBackendRequiredFormat(author_list) {
        const formatted_author_list = [];
        for (const author_details of author_list) {
            formatted_author_list.push(this.backend_compatible_author_list.filter(obj => obj['id'] === author_details['id'])[0]);
        }
        return formatted_author_list;
    }

    processCategoryToBackendRequiredFormat(category_list) {
        const formatted_category_list = [];
        for (const category_details of category_list) {
            formatted_category_list.push(this.backend_compatible_category_list.filter(obj => obj['id'] === category_details['id'])[0]);
        }
        return formatted_category_list;
    }
    // Think about optimising this code block, move it to a service, Ends here

    update_tag_selection(val) {
        this.post.tags = this.processTagToBackendRequiredFormat(val);
    }

    update_category_selection(val) {
        this.post.categories = this.processCategoryToBackendRequiredFormat(val);
    }

    update_author_selection(val) {
        this.post.degaUsers = this.processAuthorToBackendRequiredFormat(val);
    }
}
