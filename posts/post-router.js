const express = require('express');
const { count } = require('../data/db-config.js');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const posts = await db('posts');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'error getting posts', error: err });
    };
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [post] = await db('posts').where({ id });
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'bad id' });
        }
    } catch (err) {
        res.status(500).json({ message: 'db error', error: err });
    }
});

router.post('/', async (req, res) => {
    const post = req.body;
    try {
        await db('posts').insert(post);
        res.json({ insert: post });
    } catch (err) {
        res.status(500).json({ message: 'error posting record', error: err });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    try {
        const count = await db('posts').update(changes).where({ id });
        if (count) {
            res.json({ updated: count });
        } else {
            res.status(404).json({ message: 'invalid id' });
        }
    } catch (err) {
        res.status(500).json({ message: 'error updating record', error: err });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const count = await db('posts').where({ id }).del();
        if (count) {
            res.json({ deleted: count });
        } else {
            res.status(404).json({ message: 'invalid id' });
        }
    } catch (err) {
        res.status(500).json({ message: 'error deleting record', error: err });
    }

});

module.exports = router;