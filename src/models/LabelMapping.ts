export interface LabelMapping {
  userId: string;
  labels: {
    review: string; // Gmail label id for 'cleaner-review'
    archive: string; // Gmail label id for 'cleaner-archive'
    junk: string; // Gmail label id for 'cleaner-junk'
  };
}
