import Comment from "./Comment";

const Comments = ({ postId }) => {
  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      <form className="flex items-center justify-between gap-8 w-full">
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full p-4 focus:outline-none focus:ring-2 focus:ring-[#391600] focus:ring-offset-1 rounded-xl"
        />
        <button className="bg-[#391600] px-4 py-3 text-white font-medium rounded-xl">
          Send
        </button>
      </form>
      <Comment />
      <Comment />
      <Comment />
      <Comment />
    </div>
  );
};

export default Comments;
