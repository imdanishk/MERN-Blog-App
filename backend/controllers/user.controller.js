import User from "../models/user.model.js";

export const getUserSavedPosts = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) return res.status(404).json("User not found");

    res.status(200).json(user.savedPosts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch saved posts", details: err.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const postId = req.body.postId;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) return res.status(404).json("User not found");

    const isSaved = user.savedPosts.includes(postId);

    await User.findByIdAndUpdate(user._id, {
      [isSaved ? "$pull" : "$push"]: { savedPosts: postId },
    });

    res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
  } catch (err) {
    res.status(500).json({ error: "Failed to save/unsave post", details: err.message });
  }
};
