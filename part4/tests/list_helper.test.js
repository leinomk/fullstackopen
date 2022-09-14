const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(testHelper.listWithOneBlog)
    expect(result).toBe(testHelper.listWithOneBlog[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(testHelper.initialBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('when there are no blogs is empty object', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

  test('when there is only one blog is that', () => {
    const result = listHelper.favoriteBlog(testHelper.listWithOneBlog)
    expect(result)
      .toEqual({
        title: testHelper.listWithOneBlog[0].title,
        author: testHelper.listWithOneBlog[0].author,
        likes: testHelper.listWithOneBlog[0].likes,
      })
  })

  test('of a bigger list is determined right', () => {
    const result = listHelper.favoriteBlog(testHelper.initialBlogs)
    expect(result)
      .toEqual({
        title: testHelper.initialBlogs[2].title,
        author: testHelper.initialBlogs[2].author,
        likes: testHelper.initialBlogs[2].likes,
      })
  })
})

describe('most active author', () => {
  test(' is determined correctly when there is one blog', () => {
    const result = listHelper.mostBlogs(testHelper.listWithOneBlog)
    expect(result)
      .toEqual({
        author: testHelper.listWithOneBlog[0].author,
        blogs: 1,
      })
  })

  test(' is determined correctly when there are several blogs', () => {
    const result = listHelper.mostBlogs(testHelper.initialBlogs)
    expect(result)
      .toEqual({
        author: testHelper.initialBlogs[3].author,
        blogs: 3,
      })
  })

  test('is an empty object if the blogs list is empty', () => {
    const result = listHelper.mostBlogs([])
    expect(result)
      .toEqual({})
  })
})

describe('most liked author', () => {
  test('is determined correctly with only one blog', () => {
    const result = listHelper.mostLikes(testHelper.listWithOneBlog)
    expect(result)
      .toEqual({
        author: testHelper.listWithOneBlog[0].author,
        likes: testHelper.listWithOneBlog[0].likes,
      })
  })

  test('is determined correctly when there are several blogs', () => {
    const result = listHelper.mostLikes(testHelper.initialBlogs)
    expect(result)
      .toEqual({
        author: testHelper.initialBlogs[1].author,
        likes: 17,
      })
  })

  test('is an empty object if the blogs list is empty', () => {
    const result = listHelper.mostLikes([])
    expect(result)
      .toEqual({})
  })
})
