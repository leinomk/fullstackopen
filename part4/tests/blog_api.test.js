const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const getValidToken = async () => {
  const user = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  }

  const loginResponse = await api
    .post('/api/login')
    .send(user)

  return loginResponse.body.token
}

const addBlogs = async () => {
  const token = await getValidToken()

  helper.initialBlogs.forEach(async (blog) => {
    await api
      .post('/api/blogs')
      .send(blog)
      .set('Authorization', `bearer ${token}`)
  })
}

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await api
      .post('/api/users')
      .send(helper.initialUsers[0])

    await addBlogs()
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)

    const blogTitles = response.body.map((b) => b.title)
    expect(blogTitles).toContain('React patterns')
  })

  test('blog identification is defined as id', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

  describe('adding a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = new Blog({
        title: 'testblog',
        author: 'unknown',
        url: 'http://testurl.com',
        likes: 3,
        user: '5c470bd33e69c862b1796863',
      })

      const token = getValidToken()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1)

      const blogTitles = blogsAfter.map((b) => b.title)
      expect(blogTitles).toContain('testblog')
    })

    test('likes is initialized to zero, if not given', async () => {
      const newBlog = new Blog({
        title: 'testblog',
        author: 'unknown',
        url: 'http://testurl.com',
        user: '5c470bd33e69c862b1796863',
      })

      const token = getValidToken()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter[blogsAfter.length - 1].likes).toEqual(0)
    })

    test('fails if title is not given', async () => {
      const blog = new Blog({
        author: 'unknown',
        url: 'http://notanurl.com',
        user: '5c470bd33e69c862b1796863',
      })

      const token = getValidToken()

      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `bearer ${token}`)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(helper.initialBlogs.length)
    })

    test('fails if url is not given', async () => {
      const blog = new Blog({
        title: 'no title',
        author: 'unknown',
        user: '5c470bd33e69c862b1796863',
      })

      const token = getValidToken()

      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `bearer ${token}`)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(helper.initialBlogs.length)
    })

    test('fails if user id is not given', async () => {
      const blog = new Blog({
        title: 'no title',
        author: 'unknown',
        url: 'http://notanurl.com',
      })

      const token = getValidToken()

      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `bearer ${token}`)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with 204 if id and token are valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const token = getValidToken()

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map((blog) => blog.title)

      expect(titles).not.toContain(blogToDelete.title)
    })

    test('fails with 401 if token is invalid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'bearer notavalidtoken')
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const titles = blogsAtEnd.map((blog) => blog.title)

      blogsAtStart.forEach((blog) => {
        expect(titles).toContain(blog.title)
      })
    })

    test('fails with 404 if id is invalid', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const token = getValidToken()

      await api
        .delete('/api/blogs/definitelynotanid')
        .set('Authorization', `bearer ${token}`)
        .expect(404)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const titles = blogsAtEnd.map((blog) => blog.title)

      blogsAtStart.forEach((blog) => {
        expect(titles).toContain(blog.title)
      })
    })
  })

  describe('updating a blog', () => {
    test('succeeds with 200 if content and id are valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: blogToUpdate.likes + 1 })
        .expect(200)

      const blogAfter = await api.get(`/api/blogs/${blogToUpdate.id}`)
      expect(blogAfter.body.likes).toEqual(blogToUpdate.likes + 1)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
