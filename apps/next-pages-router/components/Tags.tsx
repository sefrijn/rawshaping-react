import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/lib/fetchTags";
import Link from "next/link";

const tagFontSize = (count: number) => {
  // Make a better algorithm. Above a certain threshold, the amount of font size to increase should be smaller.
  // Then on another threshold, the font size is maxed out.

  const minFontSize = 5;
  const threshold1 = 10;
  const threshold2 = 20;
  const increment1 = 0.8;
  const increment2 = 0.3;

  // Calculate the max font size
  const maxFontSize =
    minFontSize +
    threshold1 * increment1 +
    (threshold2 - threshold1) * increment2;

  // Example with count 5
  // minFontSize + 5 = 10

  // Example with count 11
  // 11 - 10 = 1 the amount that should be increased by 0.5
  // 1 * 0.5 = 0.5
  // minFontSize + threshold1 + 0.5 = 15.5

  // Example with count 20
  // Max font size is reached

  if (count <= threshold1) {
    return `${minFontSize + count * increment1}px`;
  } else if (count <= threshold2) {
    return `${
      minFontSize + threshold1 * increment1 + (count - threshold1) * increment2
    }px`;
  } else {
    return `${maxFontSize}px`;
  }
};

type Tag = {
  id: number;
  name: string;
  slug: string;
  count: number;
};
export function Tags() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  return (
    <div className="hidden lg:flex flex-wrap content-center justify-center gap-x-2">
      {/* Filter tags with count larger than 1 */}
      {/* Randomize the order of the tags */}
      {/* Show different fontsize based on count */}
      {data
        ?.filter((tag: Tag) => tag.count >= 1)
        .sort(() => Math.random() - 0.5)
        .map((tag: Tag) => (
          <Link
            className={"!flex items-center justify-center !leading-6 group"}
            href={`/tag/${tag.slug}`}
            style={{
              fontSize: tagFontSize(tag.count),
            }}
            key={tag.id}
          >
            <span className="block text-grey group-hover:text-primary tracking-tighter">
              {tag.name}
            </span>
          </Link>
        ))}
    </div>
  );
}
