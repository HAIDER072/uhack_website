const express = require('express');
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const hbs = require("hbs");
const port = process.env.PORT || 3000;
dotenv.config({ path: './.env' });
require("./db/conn")

const User = require("./models/signup");
const sosN = require("./models/sosNum");

const static_path = path.join(__dirname, "../public");


    
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
// app.use(express.static(static_path2));
app.set("view engine", "hbs");


app.get("/", (_req, res) => {
    res.render('index')
    // res.set({
    //     "Allow-access-Allow-Origin":'*'
    // })
    // return res.redirect('index.html')
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(static_path, 'login.html'));
})

// sign_up
app.post("/sign_up", async(req, res) => {
    try {
             const userData = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                who:req.body.who
            });
        const userdataRegister = await userData.save();
        res.status(201).sendFile(path.join(static_path, 'login.html'));
    } catch (error) {
        res.status(400).send(error);
    }
})
// login
app.post("/login",async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const who = req.body.who;
        const useremail = await User.findOne({ email: email });
        
        if (useremail.password === password) {
            if (useremail.who=="user") {
                res.render('sos', { username: useremail.username });
            } else {
                res.status(201).sendFile(path.join(static_path, 'index.html'));
            }
            // console.log(useremail.username);//if ke andar username nahi store hoga !!!!
            
        } else {
            res.send("Invalid login Details");
        }

    } catch (error) {
        res.status(400).send("Invalid Email!!!!");
    }


    // sos contact
// app.get('/sos', (req, res) => {
//     const userName = req.body.username; // Assuming you're getting the username from the request body
//     //   res.send(userName); 
//     // Render the 'sos' template with the username from the request body
//     res.render('sos.hbs', { username: userName });

//           });


})
// twilo API
app.get("/sos", (req, res) => {
    sendTextmessage();
    res.send(`
    <h1>your call is being make <h1>`)
})




app.listen(port, () => {
    console.log(`server is running at port no. ${port}`)
})

function sendTextmessage() {
    
}