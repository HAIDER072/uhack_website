const express = require('express');
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const hbs = require("hbs");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const port = process.env.PORT || 3000;
dotenv.config({ path: './.env' });
require("./db/conn")
require("./db/sosNum")
const client = require('twilio')(accountSid, authToken);
const User = require("./models/signup");
const sosN = require("./models/sosNum");
const { error } = require('console');

const static_path = path.join(__dirname, "../public");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");

app.get("/", (_req, res) => {
    res.render('index')
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(static_path, 'login.html'));
})

app.post("/sign_up", async (req, res) => {
    try {
        const userData = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            who: req.body.who
        });
        const userdataRegister = await userData.save();
        res.status(201).sendFile(path.join(static_path, 'login.html'));
    } catch (error) {
        res.status(400).send(error);
    }
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const who = req.body.who;
        const useremail = await User.findOne({ email: email });

        if (useremail.password === password) {
            if (useremail.who == "user") {
                res.render('sos', { username: useremail.username });
            } else {
                res.status(201).sendFile(path.join(static_path, 'index.html'));
            }
        } else {
            res.send("Invalid login Details");
        }

    } catch (error) {
        res.status(400).send("Invalid Email!!!!");
    }
})

app.post("/sos", async (req, res) => {
    try {
        const sosData = new sosN({
            phone1: req.body.phone1,
            phone2: req.body.phone2,
            phone3: req.body.phone3
        });
        const usersosdataRegister = await sosData.save();
        const phoneNumbers = await getPhoneNumbers();

            phoneNumbers.forEach((phoneNumber) => {
                sendTextmessage(phoneNumber);
                sendCall(phoneNumber);
            });

        res.render("welcome");
    } catch (error) {
        res.status(400).send(error);
    }
})

const getPhoneNumbers = async () => {
    try {
        const mostRecentData = await sosN
            .findOne()
            .sort({ _id: -1 })
            .select('phone1 phone2 phone3')
            .lean()
            .exec();

        if (mostRecentData) {
            const phoneNumbers = [
                mostRecentData.phone1,
                mostRecentData.phone2,
                mostRecentData.phone3
            ];
            return phoneNumbers;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching phone numbers from the database:', error);
        return [];
    }
};

app.listen(port, () => {
    console.log(`server is running at port no. ${port}`)
})

function sendTextmessage(phoneNumber) {
    client.messages.create({
        body: "hello ...............",
        to: '+91' + phoneNumber,
        from: "+12569065690"
    }).then(message => console.log(`Message sent to ${phoneNumber}:`, message))
        .catch(error => console.log(error))
}

function sendCall(phoneNumber) {
    client.calls
        .create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            to: '+91' + phoneNumber,
            from: '+12569065690',
        })
        .then((call) => console.log('Call initiated:', call.sid))
        .catch((error) => console.error('Error making call:', error));
}

