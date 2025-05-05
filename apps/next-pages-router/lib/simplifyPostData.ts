import { decode } from 'html-entities';

export function simplifyPostData(post: any) {
  const { _embedded, _links, ...result } = post;
  if (post._embedded?.['wp:featuredmedia'] && post._embedded?.['wp:featuredmedia'].length > 0) {
    result.featuredImage = {
      title: post._embedded?.['wp:featuredmedia'][0].title.rendered,
      sizes: post._embedded?.['wp:featuredmedia'][0].media_details.sizes,
      source: {
        source_url: post._embedded?.['wp:featuredmedia'][0].source_url,
        width: post._embedded?.['wp:featuredmedia'][0].media_details.width,
        height: post._embedded?.['wp:featuredmedia'][0].media_details.height,
        mime_type: post._embedded?.['wp:featuredmedia'][0].mime_type,
      },
    };
  }

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

  // If post.post_size is 0, make a 10% chance to return 5 or 6
  if (parseInt(post.post_size) === 0 || post.post_size === "") {
    const random = Math.random();
    if (random < 0.1) {
      result.post_size = 6;
    } else if (random < 0.2) {
      result.post_size = 5;
    }
  }

  result.title = decode(post.title.rendered);
  return result;
}
