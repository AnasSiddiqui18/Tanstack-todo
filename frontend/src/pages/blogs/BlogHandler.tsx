import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog, updateBlog } from "@/api/index";
import { useToast } from "@/components/ui/use-toast";
import { BlogType } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface BlogHandlerProps {
  blog?: BlogType;
  isUpdate: boolean;
}

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
});

export const BlogHandler: React.FC<BlogHandlerProps> = ({
  blog,
  isUpdate = false,
}) => {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const cache = useQueryClient();

  const createBlogMutation = useMutation({
    mutationKey: ["CREATE_BLOG"],
    mutationFn: createBlog,

    onSuccess: () => {
      setOpen(false);
      console.log("Blog added successfully");
      cache.invalidateQueries({
        queryKey: ["BLOGS"],
      });
    },

    onError: (err) => {
      setOpen(false),
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
    },
  });

  const updateBlogMutation = useMutation({
    mutationKey: ["UPDATE_BLOG"],
    mutationFn: updateBlog,

    onSuccess: () => {
      setOpen(false);
      console.log("Blog Updated Successfully!");
      cache.invalidateQueries({
        queryKey: ["BLOGS"],
      });
    },

    onError: (err) => {
      setOpen(false);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: (isUpdate && blog?.title) || "",
      content: (isUpdate && blog?.content) || "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (isUpdate) {
      updateBlogMutation.mutate({
        id: blog?._id as string,
        title: data.title,
        content: data.content,
      });
    } else {
      createBlogMutation.mutate({
        title: data.title,
        content: data.content,
      });
    }
  };

  const resetFormValues = useCallback(() => {
    // Reset form values using the reset function from react-hook-form
    reset({
      title: "",
      content: "",
    });
  }, [reset]);

  useEffect(() => {
    if (!open) {
      resetFormValues();
    }
  }, [resetFormValues, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          onClick={() => {
            setOpen(true);
          }}
        >
          {isUpdate ? "Update" : "Add"} Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Update" : "Add"} Blog</DialogTitle>
          <DialogDescription>
            Enter your blog title and content
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            className="flex flex-col gap-4 justify-end"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label htmlFor="title">Title</label>
            <div>
              <Input type="text" {...register("title")} />
              {errors.title && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    textAlign: "center",
                  }}
                  className="error"
                >
                  {errors.title.message}
                </div>
              )}
            </div>

            <label htmlFor="content">Content</label>
            <div>
              <Input type="text" {...register("content")} />
              {errors.content && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    textAlign: "center",
                  }}
                  className="error"
                >
                  {errors.content.message}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button className="mt-4" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
