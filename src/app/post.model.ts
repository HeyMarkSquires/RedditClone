export interface Post {
    uid: string;
    posteruid: string | undefined;
    timestamp: Date;
    title: string;
    content: string;
  }