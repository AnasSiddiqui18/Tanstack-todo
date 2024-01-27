import { BlogHandler } from "./BlogHandler";
import { BlogCard } from "./BlogCard";
import { useQuery } from "@tanstack/react-query";
import { BlogType } from "@/types";
import { getBlogs } from "@/api";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Blogs() {
  const {
    isLoading,
    data: blogs,
    error,
    isError,
  } = useQuery<BlogType[]>({
    queryKey: ["BLOGS"],
    queryFn: getBlogs,
  });

  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  console.log(cardRefs.current); // Log the current object containing key-value pairs

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      const newBlogId = blogs[blogs?.length - 1]._id;
      const divToAnimate = cardRefs.current[newBlogId];

      if (newBlogId && divToAnimate) {
        const tl = gsap.timeline();
        tl.fromTo(
          divToAnimate,
          {
            y: 50,
            opacity: 0,
            duration: 0.5,
          },
          {
            y: 0,
            opacity: 1,
          }
        );
      }
    }
  }, [blogs]);

  if (isLoading)
    return (
      <div className="flex justify-center w-full  flex-col items-center  gap-7 mt-8">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center w-full flex-col items-center gap-7 mt-8 text-red-500">
        {error.message}
      </div>
    );

  return (
    <div className="max-w-md mx-auto">
      <div className="flex w-full justify-end mt-4 gap-4">
        <BlogHandler isUpdate={false} />
      </div>
      {blogs?.length === 0 ? (
        <div>Currently no blogs are present</div>
      ) : (
        <div className="flex justify-center w-full  flex-col items-center  gap-7 mt-8">
          {blogs?.map((blog) => (
            <BlogCard
              blog={blog}
              key={blog._id}
              cardRefs={cardRefs} // Pass down the cardRefs object to each BlogCard
            />
          ))}
        </div>
      )}
    </div>
  );
}
