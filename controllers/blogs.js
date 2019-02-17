const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  console.log('auth')
  console.log(authorization)
  if (authorization && authorization.startsWith('Bearer')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async(request, response, next) => {
  const body = request.body
  
  const token = getTokenFrom(request)
  console.log(token)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined || request.body.url === undefined) {
      response.status(400)
    }
  
    if (body.likes === undefined) {
      body.likes = 0
    }
  
    const user = await User.findById(decodedToken.id)
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  
    response.json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }

  
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON())
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const token = getTokenFrom(request)
  console.log("saatiin token")
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log('saatiin decoded token')
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      console.log("token ei toimi")
      return response.status(401).json({ error: 'only the user who created the blog can remove it' })
    }

  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter