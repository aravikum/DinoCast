'use client';
 
import { useState } from 'react';
import axios from 'axios'; 

export default function LikeButton(props) {
  const [likes, setLikes] = useState(props.likes);
  const [liked, setLiked] = useState(false);
 
  async function handleClick() {
    const { comment_id } = props;
    console.log(comment_id);
    // axios.post(`http://localhost:8000/comments/test/${comment_id}/s`) 
    //     .then((response) => {
    //         console.log('Tested Successfully');
    //     })
    //     .catch((error) => {
    //         console.error('Error testing:', error);
    //     });
    if (!liked) {
      try {
        await axios.post(`http://localhost:8000/comments/like/${comment_id}/`) 
            .then((response) => {
                setLikes(prevLikes => prevLikes + 1);
                setLiked(true);
                console.log('Like Added Successfully');
            })
            .catch((error) => {
                console.error('Error liking comment:', error);
            });
      } catch (error) {
        console.error('Failed to like the comment');
      }
    } else {
        try {
            await axios.delete(`http://localhost:8000/comments/like/${comment_id}/`) 
                .then((response) => {
                    setLikes(prevLikes => prevLikes - 1);
                    setLiked(false);
                    console.log('Like Removed Successfully');
                })
                .catch(function (error) {
                    if (error.response) {
                      console.log(error.response.data);
                      console.log(error.response.status);
                      console.log(error.response.headers);
                    }
                  });
                // .catch((error) => {
                //     console.error('Error Unliking comment:', error);
                // });
          } catch (error) {
            console.error('Failed to unlike the comment');
          }
    }
  }
 
  return <button onClick={handleClick}>{liked ? 'Liked' : 'Like'} ({likes})</button>;
}
