import { convertToWordpressQueryParams } from './convertToWordpressQueryParams';
import { simplifyPostData } from './simplifyPostData';
import type { Fields } from './types';

const defaultPostFields: Fields[] = ['slug', 'title', 'featured_media', 'date', 'tags', 'post_size', 'content', 'excerpt'];

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export const createQueryParamString = (queryParams: any) => {
  return Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export async function fetchPostBySlug(slug: string | string[] | undefined, fields: Fields[] = defaultPostFields) {
  if (!slug) return null;

  const fieldParams = convertToWordpressQueryParams(fields);
  const qs = createQueryParamString(fieldParams);

  const response = await fetch(`${baseUrl}/posts/slug/${slug}?${qs}`);

  const data = await response.json();
  return simplifyPostData(data);
  // return data.map(simplifyPostData)[0];
}



