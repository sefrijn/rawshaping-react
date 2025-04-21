import { decode } from 'html-entities';

export function simplifyPostData(post: any) {
  const { _embedded, _links, ...result } = post;
  result.featuredImage = {
    title: post._embedded?.['wp:featuredmedia'][0].title.rendered,
    sizes: post._embedded?.['wp:featuredmedia'][0].media_details.sizes,
  };

  const embeddedTerms = post._embedded?.['wp:term'];
  if (embeddedTerms && embeddedTerms.length > 0) {
    for (const tag of embeddedTerms) {
      if (!tag[0]?.taxonomy) {
        continue;
      }
      result[tag[0].taxonomy] = tag.map((t: any) => {
        return {
          name: t.name,
          slug: t.slug,
        };
      });
    }
  }

  result.title = decode(post.title.rendered);
  return result;
}
