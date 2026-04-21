export const scorePosts = (posts) => {
  const now = Date.now();

  return [...posts]
    .map((post) => {
      const ageHours = Math.max((now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60), 1);
      const engagement = (post.likes?.length || 0) * 2 + (post.comments?.length || 0) * 3 + (post.views || 0) * 0.2;
      const recency = 24 / ageHours;
      return { ...post.toObject(), score: engagement + recency };
    })
    .sort((a, b) => b.score - a.score);
};