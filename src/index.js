const app = require('./app.js')
const port = process.env.PORT;
app.listen(port, () => {
    console.log('app started in port ' + port);
})