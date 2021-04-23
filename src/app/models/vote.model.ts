export interface Vote {
    uid: string;
    postuid: string | undefined;
    upvoteState: number;
    timestamp: Date;
    useruid: string;
}