const express = require('express');

const Posts = require('../data/db');

const router = express.Router();

router.get('/', (req, res) => {
    Posts.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The posts information could not be retrieved."
            });
        });
});

router.get('/:id', (req, res) => {
    const {
        id
    } = req.params;
    Posts.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The post information could not be retrieved."
            })
        })
})

router.get('/:id/comments', (req, res) => {
    const {
        id
    } = req.params;
    Posts.findPostComments(id)
        .then(comment => {
            if (!comment) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                res.status(200).json(comment);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The comments information could not be retrieved."
            })
        })
})

router.post('/', (req, res) => {
    const postInfo = req.body;

    if (!postInfo.title || !postInfo.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    } else {
        Posts.insert(postInfo)
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: "There was an error while saving the post to the database"
                });
            });
    }
})

router.post('/:id/comments', (req, res) => {
    const {
        id
    } = req.params;
    const comment = {
        ...req.body,
        post_id: id
    }

    if (!comment.text) {
        res.status(400).json({
            errorMessage: "Please provide text for the comment."
        })
    }
    Posts.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                Posts.insertComment(comment)
                    .then(post => {
                        res.status(200).json(post)
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: "There was an error while saving the comment to the database"
                        })
                    })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "There was an error while saving the comment to the database"
            })
        })
})

router.delete('/:id', (req, res) => {
    const {
        id
    } = req.params;

    if (!id) {
        res.status(404).json({
            message: "The post with the specified ID does not exist."
        })
    } else {
        Posts.remove(id)
            .then(post => {
                res.status(200).json(post)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: "The post could not be removed"
                })
            })
    }
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    const {
        id
    } = req.params;

    if (!changes.title || !changes.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    } else {
        Posts.update(id, changes)
            .then(post => {
                if (post) {
                    res.status(200).json(post);
                } else {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist."
                    })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: "The post information could not be modified."
                })
            })
    }

})

module.exports = router;