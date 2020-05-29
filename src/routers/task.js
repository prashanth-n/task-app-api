const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth.js')
const Task = require('../models/task.js')
// to create a new task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        creatorId: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
})

//to get all tasks
//GET /tasks?completed=true
//GET /tasks?limit=10&skip=5
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        //await Task.find({ creatorId: req.user._id })  --> alternative way
        const tasks = await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        console.log('tasks', tasks.tasks)
        res.status(200).send(tasks.tasks);
    } catch (err) {
        res.status(500).send(err);
    }
})
//to get a task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, creatorId: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updatesValue = Object.keys(req.body);
    const taskUpdatesAllowed = ['description', 'completed'];
    const toAllowUpdate = updatesValue.every((update) => taskUpdatesAllowed.includes(update));
    if (!toAllowUpdate) {
        return res.status(400).send({ error: 'Update is invalid' });
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, creatorId: req.user._id })
        if (!task) {
            return res.status(404).send();
        }
        updatesValue.forEach((update) => task[updatesValue] = req.body[update])
        await task.save();
        res.status(200).send(task);
    } catch (err) {
        res.status(400).send(err);
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, creatorId: req.user._id });
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task);
    } catch (err) {
        res.status(500).send()
    }
})
module.exports = router;