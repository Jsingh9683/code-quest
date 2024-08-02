// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs"); //To install bcryptjs using npm
require('dotenv').config(); // Added this line to load environment variables


const User = require("./models/user");
const GeneralQuestion = require("./models/generalQuestion");
const GameRecord = require('./models/generalQuestionScoreSave');
const MathScore = require('./models/MathScore');
const HighScore = require('./models/mathHighScore');
const GeneralHighScore = require('./models/GeneralHighScore');
const ObjectScore = require("./models/objectScore");
const ObjectHighScore = require('./models/objectHighScore');
const wordsScore = require('./models/wordsScore');
const wordsHighScore = require('./models/wordsHighScore');




// Initialize the Express application
const app = express();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Set view engine and static files directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/public/assets", express.static("./public/assets"));






// Routes
app.get("/home", (req, res) => {
    res.render("home");
});



app.get("/", (req, res) => {
    res.render("landingPage");
});








app.get("/stuLogin", (req, res) => {
    res.render("layout/stuLogin");
});

app.get("/parentLogin", (req, res) => {
    res.render("layout/parentLogin");
});



app.get("/general-questions", async (req, res) => {
    try {
        const questions = await GeneralQuestion.find();
        res.json(questions);
    } catch (error) {
        res.status(500).send(error);
    }
});


// to get the questions form DB to App

app.get("/api/get-questions", async (req, res) => {
    try {
        const questions = await GeneralQuestion.find();
        res.json(questions);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to add a new question of GK to Database add in json format  through postman 
// post http://localhost:9091/api/add-question

app.post("/api/add-question", async (req, res) => {
    const { question, A, B, C, D, answer } = req.body;

    if (!question || !A || !B || !C || !D || !answer) {
        return res.status(400).send("All fields are required.");
    }

    const newQuestion = new GeneralQuestion({ question, A, B, C, D, answer });

    try {
        await newQuestion.save();
        res.status(201).send("Question added successfully");
    } catch (error) {
        res.status(500).send(error);
    }
});




app.post("/signup", async (req, res) => {
    const { name, email, parentPassword, childPassword } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: "Email and name are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already in use" });
        }

        // Hash passwords if provided
        const hashedParentPassword = parentPassword ? await bcrypt.hash(parentPassword, 12) : undefined;
        const hashedChildPassword = childPassword ? await bcrypt.hash(childPassword, 12) : undefined;

        const newUser = new User({
            name,
            email,
            parentPassword: hashedParentPassword,
            childPassword: hashedChildPassword

        });

        await newUser.save();
        res.render("registrationSuccess"); // Render the success page instead of sending text
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Error registering user" });
    }
});





app.post("/parentLogin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the password matches the parentPassword
        if (user.parentPassword) {
            const isMatch = await bcrypt.compare(password, user.parentPassword);
            if (isMatch) {
                // Password matches, proceed with parent login
                return res.json({
                    user: {
                        id: user._id,
                        email: user.email,
                        role: 'parent',
                        userName: user.name
                    }
                });
            }
        }

        return res.status(401).json({ error: "Invalid credentials" });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Login error" });
    }
});


app.get("/stuDashboard", (req, res) => {
    res.render("layout/stuDashboard");
});
app.get("/parentDashboard", (req, res) => {
    res.render("layout/parentDashboard");
});






app.post("/stuLogin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let isMatch;
        if (user.childPassword) {
            isMatch = await bcrypt.compare(password, user.childPassword);
            if (isMatch) {
                return res.json({
                    user: {
                        id: user._id,
                        email: user.email,
                        role: 'student',
                        userName: user.name
                    }
                });
            }
        }

        return res.status(401).json({ error: "Invalid credentials" });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Login error" });
    }
});


// -----------------------------   PARENT DASHBOARD   score to dashboard-----------------------------------------

app.get('/api/parent-dashboard/general-questions', async (req, res) => {
    try {
        const scores = await GeneralQuestionScore.find({ userId: req.query.userId }).sort({ date: 1 });
        const data = {
            dates: scores.map(score => score.date.toISOString().split('T')[0]),
            scores: scores.map(score => score.score)
        };
        res.json(data);
    } catch (error) {
        console.error('Error fetching general questions data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/parent-dashboard/math-scores', async (req, res) => {
    try {
        const scores = await MathScore.find({ userId: req.query.userId }).sort({ date: 1 });
        const data = {
            dates: scores.map(score => score.date.toISOString().split('T')[0]),
            scores: scores.map(score => score.score)
        };
        res.json(data);
    } catch (error) {
        console.error('Error fetching math scores data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/parent-dashboard/object-recognition', async (req, res) => {
    try {
        const scores = await ObjectScore.find({ userId: req.query.userId }).sort({ date: 1 });
        const data = {
            dates: scores.map(score => score.date.toISOString().split('T')[0]),
            scores: scores.map(score => score.score)
        };
        res.json(data);
    } catch (error) {
        console.error('Error fetching object recognition data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/parent-dashboard/words-game', async (req, res) => {
    try {
        const scores = await WordsScore.find({ userId: req.query.userId }).sort({ date: 1 });
        const data = {
            dates: scores.map(score => score.date.toISOString().split('T')[0]),
            scores: scores.map(score => score.score)
        };
        res.json(data);
    } catch (error) {
        console.error('Error fetching words game data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});












app.get("/maths", (req, res) => {
    console.log("Rendering maths page");
    res.render("mathGame/maths");
});

app.get("/rational", (req, res) => {
    res.render("rational");
});

app.get("/general", (req, res) => {
    res.render("generalKnowledgeGame/general");
});

app.get("/game", (req, res) => {
    res.render("generalKnowledgeGame/game");
});

// Route for the end game page
app.get("/end", (req, res) => {
    res.render("generalKnowledgeGame/end");
});







// routes for logical games index

app.get("/logicalgames", (req, res) => {
    res.render("logicalgames/logicalgames");
});


app.get("/objectrecognition", (req, res) => {
    res.render("logicalgames/objectRecognition");
});


app.get("/end-object", (req, res) => {
    res.render("logicalgames/end-object");
});


app.get("/wordsgame", (req, res) => {
    res.render("logicalgames/wordsGame");
});

app.get("/end-words", (req, res) => {
    res.render("logicalgames/end-words");
});




//port -------------------------------------------------------------



const port = 9091;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
});


// endpoint for score saving

// Score model

// const Score = require('./models/generalQuestionScoreSave');


app.post('/api/save-score', async (req, res) => {
    const { userId, score, email } = req.body;

    if (!userId || score === undefined) {
        return res.status(400).json({ error: 'User ID and score are required.' });
    }

    try {

        // Save the general score
        const gameRecord = new GameRecord({
            userId,
            email,
            score
        });
        await gameRecord.save();



        // Save the score in the GeneralHighScore collection
        const existingHighScore = await GeneralHighScore.findOne({ userId });

        if (existingHighScore) {
            // Check if the new score is higher than the existing one
            if (score > existingHighScore.score) {
                existingHighScore.score = score;
                await existingHighScore.save();
            }
        } else {
            // Create a new high score record if none exists
            const newHighScore = new GeneralHighScore({
                userId,
                email,
                score
            });
            await newHighScore.save();
        }

        // Optionally update the user's high score if you need it in the User model
        const user = await User.findById(userId);
        if (user) {
            if (score > user.highScore) {
                user.highScore = score;
                await user.save();
            }
        }

        res.status(201).json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: `Error saving score: ${error.message}` });
    }
});


app.post("/api/stuLogin", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.json({
            user: {
                id: user._id,
                email: user.email,
                highScore: user.highScore,
                // userName: data.user.name // Save the user name
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login error" });
    }
});

// ----------------------------  MATHS   ____________________________________


app.post('/api/save-math-score', async (req, res) => {
    const { userId, email, score } = req.body;

    if (!userId || !email || score === undefined) {
        return res.status(400).json({ error: 'User ID, email, and score are required.' });
    }

    try {
        const newMathScore = new MathScore({ userId, email, score });
        await newMathScore.save();
        res.status(201).json({ message: 'Math score saved successfully' });
    } catch (error) {
        console.error('Error saving math score:', error);
        res.status(500).json({ error: `Error saving math score: ${error.message}` });
    }
});

// ----------------- GET GENERAL HIGH SCORE --------------------------------


app.post('/api/get-high-score-g', async (req, res) => {
    const { userId } = req.body;


    try {
        const record = await GameRecord.findOne({ userId }).sort({ score: -1 }).exec();
        if (!record) {
            return res.json({ highScore: 0 });
        }

        res.json({ highScore: record.score });
    } catch (error) {
        console.error('Error retrieving high score:', error);
        res.status(500).json({ error: 'Error retrieving high score' });
    }
});


// --------------------- GET MATH HIGH SCORE ----------------------------------------------------

app.post('/api/get-high-score-m', async (req, res) => {
    const { userId } = req.body;

    try {
        const highScoreRecord = await HighScore.findOne({ userId });

        if (highScoreRecord) {
            res.json({ highScore: highScoreRecord.score });
        } else {
            res.json({ highScore: 0 });
        }
    } catch (error) {
        console.error('Error fetching high score:', error);
        res.status(500).json({ error: `Error fetching high score: ${error.message}` });
    }
});

// --------------------- SAVE MATH HIGH SCORE ----------------------------------------------------


app.post('/api/save-high-score', async (req, res) => {
    const { userId, email, score } = req.body;

    try {
        // Check if a record already exists for the user
        let highScoreRecord = await HighScore.findOne({ userId });

        if (highScoreRecord) {
            // Update if the new score is higher
            if (score > highScoreRecord.score) {
                highScoreRecord.score = score;
                await highScoreRecord.save();

                res.status(200).json({ message: 'High score updated successfully' });
            } else {
                res.status(200).json({ message: 'Score is not higher than the current high score' });
            }
        } else {
            // Create a new record if none exists
            highScoreRecord = new HighScore({ userId, email, score });
            await highScoreRecord.save();
            res.status(201).json({ message: 'High score saved successfully' });
        }
    } catch (error) {
        console.error('Error saving high score:', error);
        res.status(500).json({ error: `Error saving high score: ${error.message}` });
    }
});



// --------------------- SAVE OBJECT SCORE ----------------------------------------------------

app.post('/api/save-object-score', async (req, res) => {
    const { userId, email, score } = req.body;
    console.log('Received data:', req.body);

    if (!userId || !email || !score) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newScore = new ObjectScore({ userId, email, score });
        await newScore.save();
        res.status(201).json({ message: 'Score saved successfully', score: newScore });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Error saving score' });
    }
});


// --------------------- GET OBJECT HIGH SCORE ----------------------------------------------------







app.post('/api/get-high-score-object', async (req, res) => {
    const { userId } = req.body;

    try {
        const highScoreRecord = await ObjectHighScore.findOne({ userId });

        if (highScoreRecord) {
            res.json({ highScore: highScoreRecord.score });
        } else {
            res.json({ highScore: 0 });
        }
    } catch (error) {
        console.error('Error fetching high score:', error);
        res.status(500).json({ error: `Error fetching high score: ${error.message}` });
    }
});




// --------------------- SET or SET OBJECT HIGH SCORE ----------------------------------------------------



app.post('/api/save-object-high-score', async (req, res) => {
    const { userId, email, score } = req.body;

    try {
        // Check if a record already exists for the user
        let highScoreRecord = await ObjectHighScore.findOne({ userId });

        if (highScoreRecord) {
            // Update if the new score is higher
            if (score > highScoreRecord.score) {
                highScoreRecord.score = score;
                await highScoreRecord.save();

                res.status(200).json({ message: 'High score updated successfully' });
            } else {
                res.status(200).json({ message: 'Score is not higher than the current high score' });
            }
        } else {
            // Create a new record if none exists
            highScoreRecord = new ObjectHighScore({ userId, email, score });
            await highScoreRecord.save();
            res.status(201).json({ message: 'High score saved successfully' });
        }
    } catch (error) {
        console.error('Error saving high score:', error);
        res.status(500).json({ error: `Error saving high score: ${error.message}` });
    }
});
// ---------------------------- SAVE SCORE OF WORDS GAME --------------------------------------------

app.post('/api/save-score-words', async (req, res) => {
    const { userId, email, score } = req.body;

    if (!userId || !email || !score) {
        return res.status(400).json({ error: 'UserId, email, and score are required.' });
    }

    try {
        const newScore = new wordsScore({ userId, email, score });
        await newScore.save();

        // Check if this score is a new high score
        const existingHighScore = await wordsHighScore.findOne({ userId });
        if (!existingHighScore || score > existingHighScore.score) {
            await wordsHighScore.findOneAndUpdate(
                { userId },
                { score, email },
                { upsert: true, new: true }
            );
        }

        res.status(201).json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: `Error saving score: ${error.message}` });
    }
});

// -----------------------------Get high score wORDS gAME endpoint-----------------------
app.get('/api/save-high-score-words', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'UserId is required.' });
    }

    try {
        const highScore = await wordsHighScore.findOne({ userId });

        if (!highScore) {
            return res.status(404).json({ message: 'High score not found.' });
        }

        res.status(200).json(highScore);
    } catch (error) {
        console.error('Error retrieving high score:', error);
        res.status(500).json({ error: `Error retrieving high score: ${error.message}` });
    }
});



// -------------------------------- Get High Score --------------------------------


// Express route to get high score
app.post('/api/get-high-score-words', async (req, res) => {
    const { userId } = req.body;
    try {
        const highScoreRecord = await wordsHighScore.findOne({ userId });
        if (highScoreRecord) {
            res.json({ highScore: highScoreRecord.highScore });
        } else {
            res.json({ highScore: 0 });
        }
    } catch (error) {
        console.error('Error fetching high score:', error);
        res.status(500).json({ error: 'Error fetching high score' });
    }
});


// ------------------ PARENT DASHBOARD  USER  --------------------

app.get("/parentDashboard", async (req, res) => {
    const userId = req.query.userId; // Adjust as needed
    try {
        const generalQuestionsScores = await GameRecord.find({ userId }).sort({ date: 1 }).exec();
        const mathScores = await MathScore.find({ userId }).sort({ date: 1 }).exec();
        const objectScores = await ObjectScore.find({ userId }).sort({ date: 1 }).exec();
        const wordsScores = await wordsScore.find({ userId }).sort({ date: 1 }).exec();

        res.render("layout/parentDashboard", {
            generalQuestionsScores: JSON.stringify(generalQuestionsScores),
            mathScores: JSON.stringify(mathScores),
            objectScores: JSON.stringify(objectScores),
            wordsScores: JSON.stringify(wordsScores)
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Error fetching data" });
    }
});


// In your server code (e.g., index.js)
app.get('/api/parentDashboardData', async (req, res) => {
    const userId = req.query.userId; // Adjust as needed
    try {
        const generalQuestionsScores = await GameRecord.find({ userId }).sort({ date: 1 }).exec();
        const mathScores = await MathScore.find({ userId }).sort({ date: 1 }).exec();
        const objectScores = await ObjectScore.find({ userId }).sort({ date: 1 }).exec();
        const wordsScores = await wordsScore.find({ userId }).sort({ date: 1 }).exec();

        res.json({
            generalQuestionsScores,
            mathScores,
            objectScores,
            wordsScores
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Error fetching data" });
    }
});

//  --------------- get parentuser id ----------------

// Example login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Your authentication logic here
    const user = await User.findOne({ username, password });

    if (user) {
        // Send userId as part of the response
        res.json({ userId: user._id });
    } else {
        res.status(401).send('Invalid credentials');
    }
});
