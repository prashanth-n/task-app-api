const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = new express.Router();
const auth = require('../middleware/auth.js');
const User = require('../models/user.js');
const { sendWelcomeMail,sendCancelMail } = require('../emails/account.js');
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        const checkFile = file.originalname.match(/\.(jpg|jpeg|png)$/);
        console.log(checkFile);
        if (!checkFile) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
})
// to create a new user
router.post('/users/signup', async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    try {
        await user.save();
        //sendWelcomeMail(user.email,user.name);
        const authToken = await user.createAuthToken();
        res.status(201).send({ user, authToken });
    } catch (err) {
        res.status(400).send(err);
    }
})
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const authToken = await user.createAuthToken()
        res.status(200).send({ user, authToken })
    } catch (err) {
        res.status(401).send();
    }
})
router.get('/users/me', auth, async (req, res) => {
    //from middleware
    const user = req.user;
    res.status(200).send(user)

})
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isVaildOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isVaildOperation) {
        return res.status(400).send({ error: 'Update is invalid' });
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send(req.user);
    } catch (err) {
        res.status(400).send(err);
    }
})
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        //sendCancelMail(req.user.name,req.user.email)
        res.status(200).send(req.user);
    } catch (err) {
        res.status(500).send()
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.status(200).send();
    } catch (err) {
        res.status(500).send;
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch (err) {
        res.status(500).send();
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = buffer;
        await req.user.save();
        res.status(200).send();
    } catch (err) {
        res.status(400).send({ error: error.message });
    }
})
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send();
    } catch (err) {
        res.status(400).send(err)
    }
})
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = User.findById(req.parms.id)
        if (!user.avatar || !user) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.status(200).send(user.avatar)
    } catch (err) {
        res.status(404).send()
    }
})
module.exports = router;