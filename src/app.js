const express = require('express');
const app = express();
const path = require("path");
const dotenv = require("dotenv");
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
// app.set("view engine", "hbs");


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

app.post("/login", async(req, res) => {
    try {
            // If the email is not in use, proceed with user registration
             const userData = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
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

app.listen(port, () => {
    console.log(`server is running at port no. ${port}`)
})
