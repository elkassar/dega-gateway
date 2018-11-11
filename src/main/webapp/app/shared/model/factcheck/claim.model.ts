import { Moment } from 'moment';

export interface IClaim {
    id?: string;
    claim?: string;
    description?: string;
    claimDate?: Moment;
    claimSource?: string;
    checkedDate?: Moment;
    reviewSources?: string;
    review?: string;
    reviewTagLine?: string;
    clientId?: string;
    claimantName?: string;
    claimantId?: string;
    ratingName?: string;
    ratingId?: string;
}

export class Claim implements IClaim {
    constructor(
        public id?: string,
        public claim?: string,
        public description?: string,
        public claimDate?: Moment,
        public claimSource?: string,
        public checkedDate?: Moment,
        public reviewSources?: string,
        public review?: string,
        public reviewTagLine?: string,
        public clientId?: string,
        public claimantName?: string,
        public claimantId?: string,
        public ratingName?: string,
        public ratingId?: string
    ) {}
}
