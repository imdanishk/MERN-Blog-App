import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
}
export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
}

export const createPost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();

  let existingPost = await Post.findOne({ slug });

  let counter = 2;

  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  const newPost = new Post({ user: user._id, slug, ...req.body });

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
}

export const deletePost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json("User not found!");
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json("Post not found!");
  }

  const deletedPost = await Post.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletedPost) {
    return res.status(403).json("You can delete only your posts!");
  }

  res.status(200).json("Post has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
}

export const featurePost = async (req, res) => {
  try {
    const post = await Post.findById(req.body.id);
    post.featured = !post.featured;
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
}

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
  res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};