import React from 'react';
import JoditEditor from 'jodit-react';
import ReactHtmlParser from 'react-html-parser';
import { Grid, Paper, Typography, TextField, Button } from '@material-ui/core';

import './App.scss';

let username = localStorage.getItem('username') ? localStorage.getItem('username') : '';
let currentPosts = localStorage.getItem('currentPosts') ? JSON.parse(localStorage.getItem('currentPosts')) : [];

function App() {

  const testPosts = [
    {
      id:0,
      content:'<h1>Hello world</h1>',
      created_by:'akitsushima',
      comments: [
        {
          id:0,
          content:'I like this! <3',
          created_by:'blue_fox',
        },
        {
          id:1,
          content:'Yeah I agree...',
          created_by:'red_frog',
        }
      ],
      currentCommentText:'',
    },
    {
      id:1,
      content:'<h3>Bye bye world</h3>',
      created_by:'red_frog',
      comments: [
        {
          id:0,
          content:'This seems familiar..',
          created_by:'metal_jacket',
        },
        {
          id:1,
          content:'This is content that deserves to be shared.',
          created_by:'slow_sparrow',
        }
      ],
      currentCommentText:'',
    },
  ];

  if(currentPosts.length === 0){
    currentPosts = testPosts;
  }

  const [userName, setUserName] = React.useState(username);
  const [isUserSet, setIsUserSet] = React.useState(username !== '');
  const [posts, setPosts] = React.useState(currentPosts);


  const editor = React.useRef(null);
  const [currentPostContent, setCurrentPostContent] = React.useState('');

  /* Just testing the config */
  const config = {
    readonly: false
  }

  const handleChangeUsername = (e)=>{
    setUserName(e.target.value);
  }

  const handleSetUserName = ()=>{
    if(userName===''){
      alert('You must enter a username');
      return;
    }
    localStorage.setItem('username',userName);
    setIsUserSet(true);
  }

  const handleChangePostContent = (newContent)=>{
    console.log(newContent);
    console.log(newContent.target.innerHTML);
    setCurrentPostContent(newContent.target.innerHTML);
  }

  const handlePost = ()=>{
    if(currentPostContent===''){
      alert('You must enter some post content');
      return;
    }
    let newPosts = [...posts,{
      id:posts.length,
      content:currentPostContent,
      created_by:userName,
      comments:[],
    }]
    setPosts(newPosts)
    localStorage.setItem('currentPosts',JSON.stringify(newPosts));
    setCurrentPostContent('');
  }

  const handleLogout = ()=>{
    localStorage.setItem('username','');
    setUserName('')
    setIsUserSet(false);
  }

  const handleChangePostComment = (id,e)=>{
    let newPosts = [...posts];
    newPosts = newPosts.map(post=>{
      if(post.id===id){
        post.currentCommentText = e.target.value;
      }
      return post;
    });
    setPosts(newPosts);
  }

  const handleAddPostComment = (post)=>{
    if(post.currentCommentText === ''){
      alert('You must write at least one character');
      return;
    }
    if(userName === ''){
      alert('You must first register a username');
      return;
    }
    let id = post.id;
    let newPosts = [...posts];
    newPosts = newPosts.map(post=>{
      if(post.id===id){
        post.comments = [...post.comments,{
          id:post.comments.length,
          content:post.currentCommentText,
          created_by:userName,
        }];
      }
      return post;
    });
    setPosts(newPosts);
  }

  return (
    <div className="App">
        <Grid container style={{height:'100%',width:'100%'}}>
          {/* Section to display posts */}
          <Grid item xs={12} style={{height:'60%',width:'100%', overflow:'auto'}}>
            <Grid container spacing={3} style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',paddingTop:'1rem'}}>
              { posts.map(post=>(
                <Grid item xs={4} style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexFlow:'column'}}>
                    <Paper style={{height:'50%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'aliceblue', flexFlow:'column',overflow:'auto'}}>
                      { ReactHtmlParser(post.content) }
                      <Typography>Posted by {post.created_by}</Typography>
                    </Paper>
                    <Paper style={{height:'25%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'aliceblue', flexFlow:'column', overflow:'auto'}}>
                      <Typography style={{fontSize:'1rem',fontWeight:'bold'}}>Comments</Typography>
                      { post.comments.map(comment=>(
                        <div style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center', flexFlow:'column'}}>
                          <Typography>{comment.content}</Typography>
                          <Typography>by <b>{comment.created_by}</b></Typography>
                        </div>
                      )) }
                    </Paper>
                    <Paper style={{height:'25%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'aliceblue', flexFlow:'column'}}>
                      <TextField style={{marginBottom:'1rem'}} variant="outlined" value={post.currentCommentText} onChange={(e)=>{handleChangePostComment(post.id,e)}} />
                      <Button variant="outlined" color="primary" onClick={()=>{handleAddPostComment(post)}}>Comment</Button>
                    </Paper>
                </Grid>
              )) }
            </Grid>
          </Grid>
          {/* Section to write posts */}
          <Grid item xs={12}  style={{height:'40%',width:'100%'}}>
            <Grid container style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Grid item xs={2} style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  { !isUserSet && (
                    <div style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center', flexFlow:'column'}}>
                      <Typography style={{marginBottom:'1rem'}}>First, set your username</Typography>
                      <TextField style={{marginBottom:'1rem'}} variant="outlined" value={userName} onChange={handleChangeUsername} />
                      <Button style={{marginBottom:'1rem'}} variant="outlined" color="primary" onClick={handleSetUserName}>DONE</Button>
                    </div>
                  )}
                  { isUserSet && (
                      <div style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center', flexFlow:'column'}}>
                          <Typography style={{marginBottom:'1rem'}}>Welcome, { userName }!</Typography>
                          <Button style={{marginBottom:'1rem'}} variant="outlined" color="primary" onClick={handlePost}>Post</Button>
                          <Button variant="outlined" color="primary" onClick={handleLogout}>Logout</Button>
                      </div>
                  )}


                </Grid>
                <Grid item xs={10} style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <JoditEditor
                    ref={editor}
                    value={currentPostContent}
                    config={config}
                    tabIndex={1}
                    onBlur={handleChangePostContent}
                  />
                </Grid>
            </Grid>
          </Grid>
        </Grid>
    </div>
  );
}

export default App;
