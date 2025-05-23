export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export async function fetchReviewsWithUserData(reviews, axiosInstance) {
  if (!reviews || Object.keys(reviews).length === 0) return [];
  const reviewEntries = Object.entries(reviews);

  return Promise.all(
      reviewEntries.map(async ([reviewerid, review]) => {
        try {
          const userRes = await axiosInstance.get(`/user/${reviewerid}`);
          return {
            reviewerid,
            profilePic: userRes.data.profilePic,
            fullName: userRes.data.fullName,
            review,
          };
        } catch {
          return {
            reviewerid,
            profilePic: null,
            fullName: 'Unknown User',
            review,
          };
        }
      })
  );
}
