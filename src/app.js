const express = require('express');
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const hbs = require("hbs");
const port = process.env.PORT || 3000;
dotenv.config({ path: './.env' });
require("./db/conn")

const User = require("./models/signup");
// const { error } = require('console');

const static_path = path.join(__dirname, "../public");
// const static_path2 = path.join(__dirname, "../public/index.html");

    
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
    // res.render('login.html');
    res.sendFile(path.join(static_path, 'login.html'));
})

// sign_up
app.post("/sign_up", async(req, res) => {
    try {
            // If the email is not in use, proceed with user registration
             const userData = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                who:req.body.who
            });
        const userdataRegister = await userData.save();
        // res.status(201).render('index');
        // console.log(req.body.username);
        // return res.redirect("index.html");
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
        const useremail = await User.findOne({ email: email });
        
        if (useremail.password === password) {
            // res.status(201).sendFile(path.join(static_path, 'index.html'));
            // res.status(201).render("sos.hbs");
            // Render the 'sos' template with the username from the request body
            // console.log(useremail.username);//if ke andar username nahi store hoga !!!!
            res.render('sos', { username: useremail.username });
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



app.listen(port, () => {
    console.log(`server is running at port no. ${port}`)
})
