const lodash = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return total
}

const favoriteBlog = (blogs) => {
  const mostLiked = blogs
    .reduce((highestLikes, blog) => {
      if (blog.likes > highestLikes.likes || !highestLikes.likes) {
        highestLikes = {
          title: blog.title,
          author: blog.author,
          likes: blog.likes,
        }
      }
      return highestLikes
    }, {})
  return mostLiked
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = lodash.countBy(blogs, 'author')

  const mostActiveAuthor = lodash.reduce(blogsByAuthor,
    (mostBlogsWritten, blogsWritten, writer) => {
      if (!mostBlogsWritten.blogs) {
        mostBlogsWritten = {
          author: writer,
          blogs: blogsWritten,
        }
      } else if (blogsWritten > mostBlogsWritten.blogs) {
        mostBlogsWritten.author = writer
        mostBlogsWritten.blogs = blogsWritten
      }
      return mostBlogsWritten
    }, {})

  return mostActiveAuthor
}

const mostLikes = (blogs) => {
  const likesByAuthor = blogs
    .reduce((writers, blog) => {
      writers[blog.author] = writers[blog.author] || 0
      writers[blog.author] += blog.likes
      return writers
    }, {})

  const mostLikedAuthor = lodash.reduce(likesByAuthor,
    (mostLikesReceived, likesReceived, writer) => {
      if (!mostLikesReceived.likes) {
        mostLikesReceived = {
          author: writer,
          likes: likesReceived,
        }
      } else if (likesReceived > mostLikesReceived.likes) {
        mostLikesReceived.author = writer
        mostLikesReceived.likes = likesReceived
      }
      return mostLikesReceived
    }, {})
  return mostLikedAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
