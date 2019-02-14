const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.remove({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)
})

test('blogss are returned as json', async() => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of blogs returned', async() => {
  await api
    .get('/api/blogs')
    .expect(200)

  const response = await api.get('/api/blogs')
  
  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('id has been defined', async() => {
  const response = await api.get('/api/blogs')
  response.body.map(r => expect(r.id).toBeDefined())
})

test('new blog can be added', async () => {
  const newBlog = {
    title: 'Backend programming',
    author: 'S. Jokinen',
    url: 'Backend',
    likes: 123
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(response.body.length).toBe(helper.initialBlogs.length + 1)
  expect(contents).toContain(
    'Backend programming'
  )
})

test('new blog with no set likes has 0 likes', async() => {
  const newBlog = {
    title: "Backend programming",
    author: "S. Jokinen",
    url: "Backend"
  }
    
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    
  const response = await api.get('/api/blogs')

  expect(response.body[response.body.length-1].likes).toBe(0)
})

test('new blog with no title or url sends bad request', async() => {
  const newBlog = {
    author: "S. Jokinen",
    likes: 555
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})