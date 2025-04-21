import { simplifyPostData } from './simplifyPostData';
import type { Fields } from './types';

const defaultPostFields: Fields[] = ['slug', 'title', 'featured_media', 'date', 'tags', 'post_size', 'content'];

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchLatestPost(fields: Fields[] = defaultPostFields) {
  const response = await fetch(`${baseUrl}/posts?_fields=${fields.join(',')}&order_by=date&order=desc&per_page=1`);
  const data = await response.json();
  return data.map(simplifyPostData)[0];
}



