export const fetchTopLikedPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contents/top/liked`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch top liked posts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching top liked posts:', error);
      throw error;
    }
  };
  