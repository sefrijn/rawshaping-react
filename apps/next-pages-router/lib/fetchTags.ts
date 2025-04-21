import { convertToWordpressQueryParams } from './convertToWordpressQueryParams';
import { simplifyPostData } from './simplifyPostData';
import type { Fields } from './types';
import type { PostType, QueryParams } from './types';



const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchTags(
) {
  // Order by count descending
  try {
    const url = `${baseUrl}/tags?per_page=30&page=1&order=desc&orderby=count&fields=id,name,slug,count`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}



