const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async(request, response) => {
  if (request.body.title === undefined || request.body.url === undefined) {
    response.status(400)
  }

  if (request.body.likes === undefined) {
    request.body.likes = 0
  }
  const blog = new Blog(request.body)

  try {
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    console.log(exception)
    //next(exception)
  }
})

module.exports = blogsRouter