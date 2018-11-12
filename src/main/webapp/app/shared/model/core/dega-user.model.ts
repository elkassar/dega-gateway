import { IOrganization } from 'app/shared/model/core/organization.model';
import { IPost } from 'app/shared/model/core/post.model';

export interface IDegaUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    website?: string;
    facebookURL?: string;
    twitterURL?: string;
    instagramURL?: string;
    linkedinURL?: string;
    githubURL?: string;
    profilePicture?: string;
    description?: string;
    slug?: string;
    enabled?: boolean;
    emailVerified?: boolean;
    email?: string;
    roleName?: string;
    roleId?: string;
    organizations?: IOrganization[];
    organizationDefaultName?: string;
    organizationDefaultId?: string;
    organizationCurrentName?: string;
    organizationCurrentId?: string;
    posts?: IPost[];
}

export class DegaUser implements IDegaUser {
    constructor(
        public id?: string,
        public firstName?: string,
        public lastName?: string,
        public displayName?: string,
        public website?: string,
        public facebookURL?: string,
        public twitterURL?: string,
        public instagramURL?: string,
        public linkedinURL?: string,
        public githubURL?: string,
        public profilePicture?: string,
        public description?: string,
        public slug?: string,
        public enabled?: boolean,
        public emailVerified?: boolean,
        public email?: string,
        public roleName?: string,
        public roleId?: string,
        public organizations?: IOrganization[],
        public organizationDefaultName?: string,
        public organizationDefaultId?: string,
        public organizationCurrentName?: string,
        public organizationCurrentId?: string,
        public posts?: IPost[]
    ) {
        this.enabled = this.enabled || false;
        this.emailVerified = this.emailVerified || false;
    }
}
