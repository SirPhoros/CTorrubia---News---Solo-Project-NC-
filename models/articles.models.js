const db = require('../db/connection')
const format = require('pg')

exports.selectArticleID = (articleId) => {
	let queryStr = `
    SELECT * FROM articles
    WHERE article_id = $1;
    `
	return db.query(queryStr, [articleId]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: 'No article found with that ID',
			})
		}
		return result.rows
	})
}

exports.selectArticles = () => {
	// console.log("in model")
	let queryStr = `
	SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(*)::INT as comment_count
	FROM articles
	JOIN comments ON comments.article_id = articles.article_id
	GROUP BY articles.article_id
	ORDER BY articles.created_at DESC
	`
	return db.query(queryStr).then((result) => {
		return result.rows
	})
}

exports.addCommentByArticleID = (articleComment, articleID) => {
	const { username, body } = articleComment
	if (!body) {
		return Promise.reject({ status: 400, msg: 'Bad request: A comment is required' })
	}
	const queryParams = [username, body, articleID]

	let queryStr = `INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`

	return db.query(queryStr, queryParams).then((result) => {
		return result.rows[0]
	})
	// console.log(
	// )
	// return db
	// 	.query(queryStr, [articleComment.username, articleComment.body, articleID])
	// 	.then((result) => {
	// 		console.log(result)
	// 		// if (result.rows.length === 0) {
	// 		// 	return Promise.reject({ status: 404, msg: 'Article not found' })
	// 		// }
	// 		return result.rows[0]
	// 	})
}
