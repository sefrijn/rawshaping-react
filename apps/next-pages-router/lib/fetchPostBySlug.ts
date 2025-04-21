import { simplifyPostData } from './simplifyPostData';
import type { Fields } from './types';

const defaultPostFields: Fields[] = ['slug', 'title', 'featured_media', 'date', 'tags', 'post_size', 'content'];

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchPostBySlug(slug: string | string[] | undefined, fields: Fields[] = defaultPostFields) {
  if (!slug) return null;
  const response = await fetch(`${baseUrl}/posts?slug=${slug}&_fields=${fields.join(',')}`);
  const data = await response.json();
  return data.map(simplifyPostData)[0];
}



