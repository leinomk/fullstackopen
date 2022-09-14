const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there are initially some users at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'terotapio',
      name: 'Tero Kärkkäinen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mleino',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails if username or password is not given',
    async () => {
      const usersAtStart = await helper.usersInDb()

      const noPassword = {
        username: 'kleino',
        name: 'Mauri Leino',
      }

      const firstResult = await api
        .post('/api/users')
        .send(noPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(firstResult.body.error).toContain('password is invalid')

      const noUserName = {
        name: 'Mauri Leino',
        password: 'verysekret',
      }

      const secondResult = await api
        .post('/api/users')
        .send(noUserName)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(secondResult.body.error).toContain('`username` is required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
  mongoose.connection.close()
})
