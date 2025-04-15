import { Link } from "react-router-dom";
import Image from "./Image";

const PostListItem = ({ post }) => {

  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12">
      {/* image */}
      <div className="md:hidden xl:block xl:w-1/3">
        <Image src="postImg.jpeg" className="rounded-2xl object-cover" w="735" />
      </div>

      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link to="/test" className="text-4xl font-semibold">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ducimus ipsa atque.
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link className="text-[#391600]" to={`/posts`}>Username</Link>
          <span>on</span>
          <Link className="text-[#391600]">Category</Link>
          <span>2 days ago</span>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, unde. Eaque sed totam blanditiis autem velit corrupti reiciendis ullam dolores nisi necessitatibus, itaque sint cumque, dignissimos ipsa sit corporis labore.
        </p>
        <Link to={`/test`} className="underline text-[#391600] text-sm">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;