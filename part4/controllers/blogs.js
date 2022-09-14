/* eslint-disable consistent-return */
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      name: 1,
      username: 1,
    })
  response.json(blogs.map((blog) => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', { name: 1, username: 1 })
  response.json(blog.toJSON())
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!request.token) {
    response.status(401).json({ error: 'token not recieved' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author || 'Unknown',
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const originalBlog = await Blog.findById(request.params.id)

  const blog = {
    likes: body.likes || originalBlog.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, { likes: blog.likes }, { new: true, runValidators: true },
  )
  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    user.blogs = user.blogs.filter((b) => b.toString() !== request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'blog can be only deleted by adder' })
  }
})

module.exports = blogsRouter
