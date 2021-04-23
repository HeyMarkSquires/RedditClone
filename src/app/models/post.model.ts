export interface Post {
    uid: string;
    posteruid: string | undefined;
    upvoteCount: number;
    timestamp: Date;
    title: string;
    content: string;
  }