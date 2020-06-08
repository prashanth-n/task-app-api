const express = require('express');
require('./db/mongoose.js');
const cors = require('cors');
const app = express();
const userRoutes = require('./routers/user.js');
const taskRoutes = require('./routers/task.js');
app.use(cors())
app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);
module.exports = app;