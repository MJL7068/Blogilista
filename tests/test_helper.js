const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "API development",
    author: "A. Virtanen",
    url: "apeja.com",
    likes: 55
  },
  {
    title: "Refactoring",
    author: "V. Korhonen",
    url: "refaktorointi.com",
    likes: 20
  }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}