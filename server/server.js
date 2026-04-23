const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:*/
app.get('/genres', function (req, res) {

  //Get movies out of MovieModell
  const movies = Object.values(movieModel);
  //All Genre-Arrays confined to one list
  let allGenres = movies.map(movie => movie.Genres).flat();

//Delete duplicates and sort alphabetically 
let sortedGenres = [...new Set(allGenres)].sort();

res.send(sortedGenres);
})

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
  //Get all Movies as Array
  let movies = Object.values(movieModel)
  //Get Query-Param from URL
  const selectedGenre = req.query.genre;

  //If Genre is sent, it gets filtered
  if (selectedGenre) {
    movies = movies.filter(movie =>
      movie.Genres.includes(selectedGenre)
    );
  }
  res.send(movies);
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
