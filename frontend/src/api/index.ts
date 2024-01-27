import { Axios } from "./axios";

export const getBlogs = async () => {
  try {
    const res = await Axios.get(`/blogs`);
    return res.data; // Assuming the data is in the `data` property of the response
  } catch (error) {
    console.error(`Error while getting the blogs`, error);
    throw error;
  }
};

export const createBlog = async ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  try {
    const res = await Axios.post(`/blogs`, { title, content });
    return res.data;
  } catch (error) {
    console.error(`Error while getting the blogs`, error);
    throw error;
  }
};

export const deleteBlog = async (postId: string) => {
  try {
    const res = await Axios.delete(`/blogs/${postId}`);
    return res.data;
  } catch (error) {
    console.error(`Error while deleting the blog`, error);
    throw error;
  }
};

export const updateBlog = async ({
  title,
  content,
  id,
}: {
  title: string;
  content: string;
  id: string;
}) => {
  try {
    const { data } = await Axios.put("/blogs/", { title, content, id });

    if (data) {
      return data;
    }
  } catch (error) {
    console.log("error while updating the blog", error);
  }
};
