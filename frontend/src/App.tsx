import { Toaster } from "./components/ui/toaster";
import { Route, Routes } from "react-router-dom";
import { EachBlog } from "./pages/each-blog/EachBlog";
import { Blogs } from "./pages/blogs/Blogs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/blog/:id" element={<EachBlog />} />
      </Routes>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
};

export default App;
