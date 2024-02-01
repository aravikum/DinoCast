import React from 'react'; 
import axios from 'axios'; 
import './App.css';
import Comment from './Comment.js';

  
class App extends React.Component { 
  
  state = { 
      comments : [],
      textEntry: '',
      img_url: '',
      error: null,
  } 

  componentDidMount() { 
    this.fetchComments();
  }
  fetchComments = () => {

    axios.get('http://localhost:8000/comments') 
    .then(res => { 
        this.setState({ 
            comments : res.data.comments     
        }); 
    })
    .catch((err) => {
      this.setState({
        error: err.message || 'Error fetching comments',
      });
    });
  };
        

  submitComment = (event) => {
    const {textEntry, img_url} = this.state;
    event.preventDefault();
    // should be passing in parent id here.
    axios.post(`http://localhost:8000/comments/add/`, { text: textEntry, image: img_url, parent: null })
      .then((res) => {
        console.log('Comment posted:', res.data); // Log the response data
        this.setState({ textEntry: '', img_url: null});
        this.fetchComments(); // Fetch updated comments after adding the new one
      })
      .catch((err) => {
        console.error('Error adding comment:', err);
      });
  };

  updateTextEntry = (event) => {
    event.preventDefault();
    // update textEntry to reflect user typing
    this.setState({ textEntry: event.target.value });
  };
  
  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      this.setState({
        img_url: URL.createObjectURL(img)
      });
    }
  };
   
  RenderCommentBox = () => {
    const { textEntry} = this.state;
    return (
      <div className="CommentBox">
        <form className="comment-form" onSubmit={this.submitComment}>
          <input type="text" value={textEntry} 
            onChange={this.updateTextEntry} 
            placeholder="Add your Comment Here" style={{ width: '300px' }} />
          <br />
          <input type="file" name="myImage" onChange={this.onImageChange} />
          <button type="submit">Post Comment</button>
        </form>
      </div>
    );
  };
  
  render() { 
    const { comments } = this.state;
    const commentsMap = {}; // Map comments by their IDs
    //console.log(comments);
    // Group comments by their parent IDs
    comments.forEach(comment => {
      if (!commentsMap[comment.parent_id]) {
        commentsMap[comment.parent_id] = [];
      }
      commentsMap[comment.parent_id].push(comment);
    });
    console.log(commentsMap);
  
    const renderComments = parentId => {
      if (!commentsMap[parentId]) {
        return null;
      }
      return (
        <ul>
          {commentsMap[parentId].map((comment, index) => (
            <li key={index} style={{ paddingLeft: "25px" }}>
              <Comment
                fetchComments={this.fetchComments}
                comment={{
                  id: comment.id,
                  author: comment.author,
                  parent_id: comment.parent_id,
                  text: comment.text,
                  image: comment.image,
                  date: comment.date,
                  likes: comment.likes
                }}
              />
              {renderComments(comment.id)} {/* Recursively render children */}
            </li>
          ))}
        </ul>
      );
    };
  
    return (
      <div>
        {renderComments(null)} {/* Render comments with no parent ID (top-level comments) */}
        {this.RenderCommentBox()}
      </div>
    );
  }
} 
  
export default App;
