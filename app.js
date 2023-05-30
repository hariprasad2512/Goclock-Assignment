const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require("body-parser")

url = 'mongodb://0.0.0.0/cargoa'

mongoose.connect(url);

const con = mongoose.connection;

con.on('open', () => {
    console.log("DB connected");
})

con.on('error', (err) => {
    console.log(err);
})

const app = express()
app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.render('Landing-Main')
})


app.get('/register', (req, res) => {
    res.render('Registration')
})

app.get('/login', (req, res) => {
    res.render('LoginPage');
})

app.get('/landing-manu', (req, res) => {
    res.render('Landing-Manufacturer');
})

app.get('/landing-trans', (req, res) => {
    res.render('Landing-Transporter')
})

app.post('/signup', (req, res) => {
    const username = req.body.signupname;
    const email = req.body.signupemail;
    const password = req.body.signuppass;
    const role = req.body.role;


    const newUser = {
        userId: username,
        Email: email,
        Password: password,
        Role: role
    }

    // con.collection('users').insertOne(newUser)
    // .then(async ()=>{
    //     userName = newUser.userId;
    //     res.redirect("/login");
    // })  
    // .catch(err => console.log(err))

    if (role == "Transporter") {
        con.collection('transporters').insertOne(newUser)
            .then(async () => {
                userName = newUser.userId;
                res.redirect("/login")
            })
            .catch(err => console.log(err))
    }
    else if (role == "Manufacturer") {
        con.collection('manufacturers').insertOne(newUser)
            .then(async () => {
                userName = newUser.userId;
                res.redirect("/login")
            })
            .catch(err => console.log(err))

    }
    else {
        res.send("Wrong Input");
    }


});





app.post('/login', async (req, res) => {

    const email = req.body.logemail;
    const role = req.body.role;
    if (role == "Transporter") {
        const user = await con.collection('transporters').findOne({ Email: email });
        if (user) {
            const result = req.body.logpass === user.Password;
            if (result) {
                userName = user.userId;
                res.render("Landing-Transporter", { user: userName });
            }
            else {
                res.status(400).json({ error: "password doesn't match" });
            }

        }
        else {
            res.status(400).json({ error: "User doesn't exist" });
        }

    }
    else if (role == "Manufacturer") {
        const user = await con.collection('manufacturers').findOne({ Email: email });
        if (user) {
            const result = req.body.logpass === user.Password;
            if (result) {
                userName = user.userId;
                res.render("Landing-Manufacturer", { user: userName });
            }
            else {
                res.status(400).json({ error: "password doesn't match" });
            }

        }
        else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    }

});

app.post('/register-transporter', (req, res) => {
    res.send("User Created Successfully");
})


app.listen(3000, () => {
    console.log("listening in 3000....")
})
