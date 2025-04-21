export type PostType = 'posts' | 'page';
export interface QueryParams {
  per_page?: number;
  page?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'title' | 'slug' | 'id';
}
export type Fields =
  | 'id'
  | 'title'
  | 'content'
  | 'excerpt'
  | 'date'
  | 'slug'
  | 'link'
  | 'categories'
  | 'tags'
  | 'featured_media'
  | 'post_size';
