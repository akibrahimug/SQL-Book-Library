const express =require('express');
const router = express.Router();
const Book = require('../models').Book;

// Handler function to wrap each route
function asyncHandler(cb){
    return async(req, res, next) => {
        try{
            await cb(req, res, next)
        }catch(error){
            // forward error to the global error handler
            next(error);
        }
    }
}
// Root route And Get book from database
router.get('/', asyncHandler(async(req, res) => {
    const books = await Book.findAll()
    res.render('books/index', {books, title: "Books"})
    res.render('books/page-not-found')
}));

// Create a new book
router.post('/', asyncHandler(async(req, res) => {
    let book;
    try{
        book = await Book.create(req.body);
        res.redirect('books')
    }catch(error) {
        if(error.name === "SequelizeValidationError"){
            book = await Book.build(req.body);
            res.render('books/new', {book, errors: error.errors, title: "New Book"})
        }else{
            throw error
        }
    }
    
}));

// New book
router.get('/new', asyncHandler(async(req, res) => {
    res.render('books/new', {title: "New Book"})
}))

// Update book
router.get('/:id', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id)
    if(book){
        res.render('books/update', {book, title: 'Update Book'})
    }else{
        res.render('books/page-not-found')
    }
    
}))

// Save Updated record
router.post('/:id', asyncHandler(async(req, res) => {
    let book;
    try{
        book = await Book.findByPk(req.params.id);
        if(book){
            await book.update(req.body);
            res.redirect('/')
        }else{
            res.render('books/page-not-found')
        }
    }catch(error) {
        if(error.name === "SequelizeValidationError"){
            book = await Book.build(req.body);
            res.render('books/update', {book, errors: error.errors, title: "Update Book"})
        }else{
            throw error
        }
    }
}))

// Delete Record
router.post('/:id/delete', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book){
        await book.destroy();
        res.redirect('/')
    }else{
        res.sendStatus(404)
    }
    
}))

module.exports = router;