//import
const express=require('express');
const PORT=5000;
const app =express();
const mongoose=require('mongoose');
const {MONGOURI} =require('./key')
var cors = require('cors')

//database



mongoose.connect(MONGOURI,{ useNewUrlParser: true ,useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log("database is connected");
});


require('./models/user');
require('./models/post')
//middleware
app.use(express.json())
app.use(cors())



//routes

app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));




app.listen(PORT,()=>{
    console.log("server is running at ",PORT);
})
