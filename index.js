require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('../chapter-6/route/route');
const port =  process.env.PORT || 3000




 app.use('/images', express.static('public/images'))
 app.use('/videos', express.static('public/videos'))
 app.use('/files', express.static('public/files'))
 app.use('/', routes )

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

