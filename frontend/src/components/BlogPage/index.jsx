import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSingleArticle, createCommentAction } from '../../store/actions/blogActions';
import { useParams } from 'react-router-dom';

//player
import ReactPlayer from 'react-player';

//css
import {BlogPageStyle} from '../BlogPage/styles';

//components
import BlogHeaderComponent from '../../components/BlogHeaderComponent';

//img
import taxes1 from '../../assets/categories/taxes1.jpg';
import bank3 from '../../assets/categories/bank3.jpg';
import rent3 from '../../assets/categories/rent3.jpg';
import insurance3 from '../../assets/categories/insurance3.jpg';

//icons
import { FacebookShareButton, FacebookIcon, EmailShareButton,
EmailIcon, LinkedinShareButton, LinkedinIcon, TwitterShareButton, 
TwitterIcon, WhatsappShareButton, WhatsappIcon } from "react-share";

//css
import {BlogCardCompStyle} from './styles';


const BlogPage =()=>{
    const article = useSelector(state => state.blogReducer.current)
    const dispatch = useDispatch()
    const {category, id} = useParams()
    const [content, setContent] = useState('')
    const defaultImages = {
        "Taxes": taxes1,
        "Banking": bank3,
        "Renting": rent3,
        "Insurance": insurance3,
    }

    useEffect(() => {    
        dispatch(fetchSingleArticle(id))
    }, [])


    const onCommentSubmit = e => {
        e.preventDefault()
        dispatch (createCommentAction(id, content))
    }

    const getTimestamp = (dateStr) => {
        let timeCreated = Date.parse(dateStr)
        let timeCurrent = new Date().getTime()
        let millisecs = timeCurrent - timeCreated
        let seconds = (millisecs / 1000).toFixed(0)
        let minutes = (millisecs / (1000 * 60)).toFixed(0)
        let hours = (millisecs / (1000 * 60 * 60)).toFixed(0)
        let days = (millisecs / (1000 * 60 * 60 * 24)).toFixed(0)

        if (seconds < 60) {
            return "Just now"
        } else if (minutes < 60) {
            return minutes + " minutes ago"
        } else if (hours < 24) {
            return hours + " hours ago"
        }
        return days + " Days ago"
    }

    return article ? 
        (
            <BlogPageStyle>
            <BlogHeaderComponent />
            <div className="back-img"></div>
            <div className="article-info">  
                <div className="round-pic">
                    <div className="blog-img" style={{"backgroundImage": `url(${article.article_image.length ? article.article_image[0].image : defaultImages[article.article_category.category]})`}}></div>
                </div> 
                <div className="header-info">
                    <p className="category">{article.article_category.category}</p>
                    <p className="headline">{article.title}</p>
                    <p className="author">by {article.user ? `${article.user.first_name} ${article.user.last_name}` : ""}</p>
                    <div className="main-content">
                        <div className="article-box">
                            <p className="article">{article.content}</p>
                            { 
                             article.article_image.length  ? 
                                <div className="image-container">
                                    {article.article_image.slice(1).map((image, index) => {
                                        return <div key={index} className="uploaded-pic" style={{"backgroundImage": `url(${ image.image })`}}></div>
                                        
                                    })}
                                </div>  : null 
                            }
                            {    
                            article.article_video.length ? 
                                <div className="player">
                                    <ReactPlayer url={article.article_video[0].video}
                                    width="675px"
                                    height="385px"
                                    controls="true"
                                    />
                                </div> : null }
                        </div>
                            <div className="comment-section">
                                <div className="comment-title">Comments</div>
                                <form className="addcomment-box" onSubmit={onCommentSubmit}>
                                    <textarea name="content" onChange={(e)=> setContent(e.target.value)} className="comment-input" placeholder="add your comment here ... "/>
                                    <button type="submit" className="comment-btn">Submit</button>
                                </form>
                                {
                                    article.comment.length ?
                                        <div className="comment-container">
                                            {
                                                article.comment.map((comment, id) => 
                                                    <div key={id} className="comment-box">
                                                        <div className="single-comment">{comment.content}</div>
                                                        <div className="comment-footer">
                                                            <p className="comment-by">{`${comment.user.username}`}</p>
                                                            <p className="timestamp">{`${getTimestamp(comment.created)}`}</p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div> : null
                                }
                                <div className="social-media-icons">  
                                    <div className="social-media-icons">
                                        <FacebookShareButton className="no-border" url="https://taxjungle.propulsion-learn.ch"><FacebookIcon size={38} bgStyle={{ fill: "#ABB2B9"}} borderRadius="50%" className="icon"/></FacebookShareButton>
                                        <LinkedinShareButton className="no-border" url="https://taxjungle.propulsion-learn.ch"><LinkedinIcon size={38} bgStyle={{ fill: "#ABB2B9"}} borderRadius="50%" className="icon"/></LinkedinShareButton>
                                        <TwitterShareButton  className="no-border" url="https://taxjungle.propulsion-learn.ch"><TwitterIcon size={38}   bgStyle={{ fill: "#ABB2B9"}} borderRadius="48%" className="icon"/></TwitterShareButton> 
                                        <WhatsappShareButton className="no-border" url="https://taxjungle.propulsion-learn.ch"><WhatsappIcon size={38} bgStyle={{ fill: "#ABB2B9"}} borderRadius="50%" className="icon"/></WhatsappShareButton>
                                        <EmailShareButton    className="no-border" url="https://taxjungle.propulsion-learn.ch" subject="Check out this cool article!"><EmailIcon size={38} bgStyle={{ fill: "#ABB2B9"}} borderRadius="50%" className="icon"/></EmailShareButton>
                                    </div> 
                                </div>  
                            </div>
                    </div>
                </div>
               
            
            </div>
            </BlogPageStyle>
        ) :
        <div />
}

export default BlogPage;



