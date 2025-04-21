import type { Fields } from './types';

export function convertToWordpressQueryParams(fields: Fields[]) {
  const embedParams: string[] = [];
  const fieldParams: string[] = [];

  for (const field of fields) {
    if (field === 'featured_media') {
      embedParams.push('wp:featuredmedia');
      if (!fieldParams.includes('_links')) {
        fieldParams.push('_links');
      }
      if (!fieldParams.includes('_embedded')) {
        fieldParams.push('_embedded');
      }
      continue;
    }
    if (field === 'tags') {
      embedParams.push('wp:term');
      if (!fieldParams.includes('_links')) {
        fieldParams.push('_links');
      }
      if (!fieldParams.includes('_embedded')) {
        fieldParams.push('_embedded');
      }
      continue;
    }
    if (field === 'title') {
      fieldParams.push('title.rendered');
      continue;
    }
    fieldParams.push(field);
  }


  const fieldParamsString = fieldParams.length > 0 ? `&_fields=${fieldParams.join(',')}` : '';
  const embedParamsString = embedParams.length > 0 ? `&_embed=${embedParams.join(',')}` : '';

  return { '_fields': fieldParamsString, '_embed': embedParamsString };
}
