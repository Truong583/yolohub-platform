export interface ICourse {
  _id: string;
  title: string;
  slug: string;
  image?: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
}

export interface SearchResponse {
  courses: ICourse[];
  blogs: IBlog[];
}

export interface SearchData {
  courses: ICourse[];
  blogs: IBlog[];
}

export interface SearchParams {
  q: string;
  limit?: number;
}
