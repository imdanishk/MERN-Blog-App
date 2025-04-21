import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const CreatePostPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);

  // Add uploaded image inside editor
  useEffect(() => {
    if (img && img.url) {
      setValue(
        (prev) => prev + `<p><img src="${img.url}" alt="uploaded-img"/></p>`
      );
    }
  }, [img]);

  // Add uploaded video inside editor
  useEffect(() => {
    if (video && video.url) {
      setValue(
        (prev) =>
          prev +
          `<p><iframe class="ql-video" src="${video.url}" frameborder="0" allowfullscreen></iframe></p>`
      );
    }
  }, [video]);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/posts/create`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (res) => {
      toast.success("Post has been created!");
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error("Failed to create post.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      img: cover?.url || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };

    mutation.mutate(data);
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>You should login!</div>;

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-cl font-light">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        {/* Cover Image */}
        <div className="flex items-center gap-4">
          {!cover ? (
            <Upload type="image" setProgress={setProgress} setData={setCover}>
              <button
                type="button"
                className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white"
              >
                Add a cover image
              </button>
            </Upload>
          ) : (
            <div className="relative">
              <img
                src={cover.url}
                alt="Cover"
                className="w-40 h-28 object-cover rounded-md shadow-md"
              />
              <button
                type="button"
                onClick={() => setCover("")}
                className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="Title of a Story"
          name="title"
          required
        />

        {/* Category */}
        <div className="flex items-center gap-4">
          <label htmlFor="category" className="text-sm">
            Choose a category:
          </label>
          <select
            name="category"
            id="category"
            className="p-2 rounded-xl bg-white shadow-md"
            required
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        {/* Description */}
        <textarea
          className="p-4 focus:outline-none focus:ring-2 focus:ring-[#391600] focus:ring-offset-1 rounded-xl bg-white shadow-md"
          name="desc"
          placeholder="A Short Description"
          required
        />

        {/* Rich Text Editor with Upload Buttons */}
        <div className="flex flex-1">
          <div className="flex flex-col gap-2 mr-2">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              ▶️
            </Upload>
          </div>
          <ReactQuill
            theme="snow"
            className="flex-1 rounded-xl bg-white shadow-md"
            value={value}
            onChange={setValue}
            readOnly={0 < progress && progress < 100}
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-[#391600] text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-[#A97463] disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Loading..." : "Send"}
        </button>

        <span className="text-sm text-gray-500">Progress: {progress}%</span>
      </form>
    </div>
  );
};

export default CreatePostPage;
