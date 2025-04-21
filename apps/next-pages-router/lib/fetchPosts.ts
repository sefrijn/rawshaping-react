import { convertToWordpressQueryParams } from './convertToWordpressQueryParams';
import { simplifyPostData } from './simplifyPostData';
import type { Fields } from './types';
import type { PostType, QueryParams } from './types';

const createQueryParamString = (queryParams: QueryParams) => {
  return Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

const defaultFields: Fields[] = ['slug', 'title', 'featured_media', 'date', 'tags', 'post_size'];

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchPosts(
  postType: PostType,
  queryParams: QueryParams,
  fields: Fields[] = defaultFields
) {
  try {
    // If tag is defined, get the tag id from rest api tag endpoint
    if (queryParams.tags) {
      console.log('Fetching tag:', queryParams.tags);
      const tagResponse = await fetch(`${baseUrl}/tags?slug=${queryParams.tags}`);
      console.log('Tag url:', `${baseUrl}/tags?slug=${queryParams.tags}`);
      const tagData = await tagResponse.json();
      console.log('Tag data:', tagData[0].id);
      const tagId = tagData[0].id;
      queryParams.tags = tagId;
    }else{
      // remove tags from queryParams
      delete queryParams.tags;
    }

    const fieldParams = convertToWordpressQueryParams(fields);
    const allQueryParams = { ...queryParams, ...fieldParams};
    const qs = createQueryParamString(allQueryParams);
    let url = `${baseUrl}/${postType}?${qs}`;
    const response = await fetch(url);

    if (!response.ok)
      throw new Error(`HTTP error! Status: ${response.status}, URL: ${url}`);
  
    const totalPages = response.headers.get('X-WP-TotalPages');
    const data = await response.json();
    const posts = data.map(simplifyPostData);

    console.log('Total pages:', totalPages, 'Current page:', queryParams.page, 'URL:', url);

    return { posts, pages: totalPages, currentPage: queryParams.page };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}



