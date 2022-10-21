const Mock = require('mockjs')

const Random = Mock.Random

module.exports = () => {
  let db = { list: { data: [] } }

  for (let i = 0; i < 8; i++) {
    let content = Random.cparagraph(0, 10)

    db.list.data.push({
      ID: i,
      TITLE: Random.cword(8, 40),
      DESC: content.substr(0, 40),
      TAGS: Random.cword(2, 6),
      VIEWS: Random.integer(100, 5000),
      IMG: Random.image('120x80', Random.color(), Random.word(2, 6)),
      UPDATETIME: Random.date()
    })
  }

  return db
}
