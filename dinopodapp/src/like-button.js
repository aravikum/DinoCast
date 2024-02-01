'use client';
 
import { useState } from 'react';
import axios from 'axios'; 
export default function LikeButton(props) {
  const [likes, setLikes] = useState(props.likes);
  const [liked, setLiked] = useState(false);
 
  async function handleClick() {
    const { comment_id } = props;
    if (!liked) {
      try {
        const response = await axios.post(`http://localhost:8000/like/${comment_id}/`, {
          commentId: props.id,
        });
  
        if (response.status === 200) {
          setLikes(likes + 1);
          setLiked(true);
        } else {
          console.error('Failed to like the comment');
        }
      } catch (error) {
        console.error('Failed to like the comment');
      }
    } else {
      try {
        const response = await axios.delete(`http://localhost:8000/like/${comment_id}/`);
  
        if (response.status === 200) {
          setLikes(likes - 1);
          setLiked(false);
        } else {
          console.error('Failed to unlike the comment');
        }
      } catch (error) {
        console.error('Failed to unlike the comment');
      }
    }
  }
 
  return <button onClick={handleClick}>{liked ? 'Liked' : 'Like'} ({likes})</button>;
}
