const express = require('express');
require('./db/mongoose.js');
const app = express();
const userRoutes = require('./routers/user.js');
const taskRoutes = require('./routers/task.js');
app.use(express.json())
app.use(userRoutes)
app.use(taskRoutes)
module.exports = app;