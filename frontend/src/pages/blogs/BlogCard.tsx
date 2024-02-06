import { BlogType } from "@/types";
import { BlogHandler } from "./BlogHandler";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlog } from "@/api";
import { toast } from "@/components/ui/use-toast";

export interface BlogCardProps {
  blog: BlogType;
  cardRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, cardRefs }) => {
  // console.log(cardRefs.current);

  const cache = useQueryClient();

  const deleteBlogMutation = useMutation({
    mutationKey: ["DELETE_BLOG"],
    mutationFn: deleteBlog,

    onSuccess: () => {
      console.log("Blog deleted successfully!");

      cache.invalidateQueries({
        queryKey: ["BLOGS"],
      });
    },

    onError: (err) => {
      console.log("Error while deleting the blog", err);

      toast({
        title: "Error while deleting",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const deleteBlogHandler = (id: string) => {
    deleteBlogMutation.mutate(id);
  };

  return (
    <div
      key={blog._id}
      className="w-full rounded shadow-sm shadow-gray-600 p-4 items-center"
      ref={(element) => {
        // console.log(element);
        cardRefs.current[blog?._id] = element;
      }}
    >
      <h1 className="font-bold text-lg">{blog.title}</h1>
      <p className="text-md">{blog.content}</p>
      <div className="flex justify-end gap-4">
        <div>
          <Button
            size={"sm"}
            className="bg-red-500 text-white"
            onClick={() => deleteBlogHandler(blog._id)}
          >
            Delete
          </Button>
        </div>
        <div>
          <BlogHandler blog={blog} isUpdate />
        </div>
        <div>
          <Link to={`/blog/${blog._id}`}>
            <Button size="sm">View</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
