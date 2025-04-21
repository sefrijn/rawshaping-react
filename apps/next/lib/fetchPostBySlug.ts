import { simplifyPostData } from './simplifyPostData';
import type { Fields } from './types';

const defaultPostFields: Fields[] = ['slug', 'title', 'featured_media', 'date', 'tags', 'post_size', 'content'];

export async function fetchPostBySlug(slug: string, fields: Fields[] = defaultPostFields) {
  const response = await fetch(`${process.env.WORDPRESS_API_URL}/posts?slug=${slug}&_fields=${fields.join(',')}`);
  const data = await response.json();
  return data.map(simplifyPostData)[0];
}



