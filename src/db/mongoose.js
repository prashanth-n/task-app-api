const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DEV_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}).then(() => {
    console.log('connected to DB successfully');
}).catch((err) => {
    console.error('Could not connect to DB',err);
})