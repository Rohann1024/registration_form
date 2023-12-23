const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Use JSON middleware for parsing request bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use environment variables for database connection
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
console.log(username);
console.log(password);

const DB=`mongodb+srv://rs1220525:${password}@cluster0.0b2xl7d.mongodb.net/loginForm?retryWrites=true&w=majority`
mongoose.connect(DB).then(()=>{
  console.log('SuccessFul connection..');
}).catch((err)=>console.log('error'));

// Registration schema
const registrationSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
console.log(__dirname);
const Registration = mongoose.model('Registration', registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.render('index'); // Assuming you have a view engine configured
});

app.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    const existUser=await Registration.findOne({email: email});
    if(!existUser){
        const registrationData = new Registration({
      username,
      email,
      password
    });
    await registrationData.save();
     const message='Successfully Registered..';
      const alertMessage=`<script>
        alert("${message}");
        window.location='/success.html';
      </script>`;
      res.send(alertMessage);
    }
    else{
      const message='User Already exist..';
      const alertMessage=`<script>
        alert("${message}");
        window.location='/error.html';
      </script>`;
      res.send(alertMessage);
    }
    // Use the correct field names in the schema
  

    // Use async/await to handle the asynchronous save operation
   
  } catch (error) {
    console.log(error);
    res.redirect('/error');
  }
});

app.get('/success', (req, res) => {
 res.sendFile(path.join(__dirname,'public','success.html'));// Use path.join to specify the correct file path
});
app.get('/error', (req,res)=>{
 res.sendFile(path.join(__dirname,'public','error.html'));// Use path.join to specify the correct file path
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('App Started at Location', PORT));
