// TypeScript interfaces for the post object
interface ImageSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}
interface ImageSizes {
  thumbnail: ImageSize;
  medium: ImageSize;
  large: ImageSize;
  small: ImageSize;
  full: ImageSize;
}
interface FeaturedImage {
  title: string;
  sizes: ImageSizes;
}
interface TaxonomyTerm {
  name: string;
  slug: string;
}
export interface PostProps {
  date: string;
  slug: string;
  title: string;
  post_size: string | number;
  featuredImage: FeaturedImage;
  category: TaxonomyTerm[];
  post_tag: TaxonomyTerm[];
  content?: {
    rendered: string;
  };
}
