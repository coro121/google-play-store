//accepts the parameters sort - by 'rating' or 'app' - any other value results in an error. if no value provided, do not perform a sort
//genres - one of ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card' - if present, the value must be on eof the list, otherwise an error is returned. Filter the list by the given value]

const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const playstore = require('./playstore.js');

app.get('/apps', (req, res) => {

    //declaring constants for my list of apps. it can either be sorted or i can pick a genre
    const sort = req.query.sort;
    const genres = req.query.genres;
    let results = playstore;

    //2. validate the values

    if (genres !== undefined) {
        if (genres.toLowerCase() !== 'action' && genres.toLowerCase() !== 'puzzle' && genres.toLowerCase() !== 'strategy' && genres.toLowerCase() !== 'casual' && genres.toLowerCase() !== 'arcade' && genres.toLowerCase() !== 'card') {
            return res.status(400).send('can only filter by Action,Puzzle,Strategy,Casual,Arcade,or Card');
        }
        results = results.filter(app => {
            return app.Genres.includes(genres.charAt(0).toUpperCase() + genres.slice(1));
        });
    }

    if (sort !== undefined) {
        if (sort.toLowerCase() !== 'rating' && sort.toLowerCase() !== 'app') {
            return res.status(400).send('Can only sort by rating or app');
        }
        else if (sort.toLowerCase() === 'rating') {
            results.sort(function (a, b) {
                return b.Rating - a.Rating;
            });
        }
        else if (sort.toLowerCase() === 'app') {
            results.sort(function (a, b) {
                if (a.App < b.App) { return -1; }
                if (a.App > b.App) { return 1; }
                return 0;
            });
        }
    }


    res
        .json(results)
});

app.listen(8000, () => {
    console.log('Welcome to the Playstore!')
});