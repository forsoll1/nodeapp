const express = require("express")
const router = express.Router()
const Blog = require("../models/blogModel")

router.get("/", async (req,res) => {
    const blogs = await Blog.find({site:'micro'}).sort({
        createdAt: 'asc'
    })
    res.render('micro', { blogs: blogs, blog: new Blog()})
})
router.post("/", async (req, res) => {
    let blog = new Blog({
        site: 'micro',
        author: req.body.author,
        title: req.body.title,
        blogtext: req.body.blogtext,
    })
    try {
        blog = await blog.save()
        res.redirect(`/micro`)
    } catch (e) {
        res.render("/micro")
        console.log(e)
    }
})
router.get("/edit/:id", async (req,res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('edit', { blog:blog })
})
  
  router.put('/:id', async (req, res, ) => {
    let blog = await Blog.findById(req.params.id)
    blog.author = req.body.author
    blog.title = req.body.title
    blog.blogtext = req.body.blogtext
    try {
        blog = await blog.save()
        res.redirect(`/micro`)
    } catch (e) {
        res.render(`micro/edit/:${blog.id}`)
        console.log(e)
    }
  })

router.delete('/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/micro')
})

module.exports = router