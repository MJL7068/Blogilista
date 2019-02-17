const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer,0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((most, item) => item.likes > most.likes ? item : most, blogs[0])
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(blog => blog.author).filter((value, index, self) => self.indexOf(value) === index)
  const authorsBlogs = authors.map(name => (blogs.reduce((count, item) => item.author === name ? count = count + 1 : count = count, 0)))
  const i = authorsBlogs.indexOf(Math.max(...authorsBlogs));

  const most = {
    author: authors[i],
    blogs: authorsBlogs[i]
  }

  return most
}

const mostLikes = (blogs) => {
  const authors = blogs.map(blog => blog.author).filter((value, index, self) => self.indexOf(value) === index)
  const authorsBlogs = authors.map(name => (blogs.reduce((count, item) => item.author === name ? count = count + item.likes : count = count, 0)))
  const i = authorsBlogs.indexOf(Math.max(...authorsBlogs));

  const most = {
    author: authors[i],
    likes: authorsBlogs[i]
  }

  return most
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}