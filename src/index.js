// to start mongobd command to run C:\Users\narasimhan\mongodb\bin\mongod.exe --dbpath=C:\Users\narasimhan\mongodb-data
const express = require('express');
require('./db/mongoose.js');
const app = express();
const port = process.env.PORT;
const userRoutes = require('./routers/user.js');
const taskRoutes = require('./routers/task.js');
app.use(express.json())
app.use(userRoutes)
app.use(taskRoutes)


app.listen(port, () => {
    console.log('app started in port ' + port);
})