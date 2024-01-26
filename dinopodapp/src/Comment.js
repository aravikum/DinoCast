import React from 'react'; 
import axios from 'axios'; 
import './style.css';

class Comment extends React.Component {

    constructor(props) {
      super(props);
      console.log(props);
      this.state = {
        isEditing: false,
        editedText: props.comment.text,
        edited: false,
        editor: '',
      };
    }
    formatDate = (dateString) => {
        const date = new Date(dateString);
        // Options for formatting the date
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short'
        };
        // Convert the date to a human-readable format
        return date.toLocaleDateString('en-US', options);
    };
    handleEditClick = () => {
      this.setState({ isEditing: true });
    };
  
    handleSaveClick = () => {
      // Send a PUT or PATCH request to update the comment
      const { comment } = this.props;
      const { editedText } = this.state;
      console.log({editedText});
      if (editedText.trim() === '') {
        this.handleCancelClick();
        return;
      }
      
      //Make the API call to update the comment text
      axios.post(`http://localhost:8000/comments/${comment.id}/edit/`, { text: editedText })
        .then((response) => {
          console.log('Comment updated successfully');
          this.setState({ isEditing: false, editedText: '', edited: true, editor: 'Admin' });
          this.props.fetchComments();

        })
        .catch((error) => {
          console.error('Error updating comment:', error);
        });
  

    };
  
    handleCancelClick = () => {
      this.setState({
        isEditing: false,
        editedText: this.props.comment.text, // Reset text to original value
      });
    };
  
    handleInputChange = (event) => {
        console.log(event.target.value);
        this.setState({ editedText: event.target.value });
    };
    handleDeleteClick = () => {
        const { comment } = this.props;
      
        // Display a confirmation dialog before deleting
        const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
      
        if (confirmDelete) {
          axios.delete(`http://localhost:8000/comments/${comment.id}/delete/`)
            .then((response) => {
              console.log('Comment deleted successfully');
              this.props.fetchComments();
            })
            .catch((error) => {
              console.error('Error deleting comment:', error);
            });
        } else {
          console.log('Deletion canceled');
        }
      }

    RenderLikes = (likes) => {
        if (likes === 1) {
          return (
            <p>1 like</p>
          );
        }
        return (
          <p>
            {likes}
            {' '}
            likes
          </p>
        );
    };
  
    render() {
      const { comment } = this.props;
      const { isEditing, editedText, edited, editor } = this.state;
      const humanReadableDate = this.formatDate(comment.date);
  
      return (
        <div className='Comment'>
          {isEditing ? (
            <>
              <textarea value={editedText} onChange={this.handleInputChange} />
              <button onClick={this.handleSaveClick}>Save</button>
              <button onClick={this.handleCancelClick}>Cancel</button>
            </>
          ) : (
            <>
              {comment.image && (
                    <img src={comment.image} alt="alt" width="420" height="420" />
                  )}
                < br />
                <h4>{comment.text} </h4> 
                
                <br />
                <cite title="Contents">
                    - {comment.author}
                    {edited ? ' (edited by ' + editor + ')' : ''}
                </cite>
                <br />
                Posted {humanReadableDate}
            
                {this.RenderLikes(comment.likes)}
                <div>
                    <button onClick={this.handleEditClick} className="btn">Edit</button>
                    <button onClick={this.handleDeleteClick} className="btn">Delete</button>
                </div>

            </>
          )}
        </div>
      );
    }
  }
  export default Comment;