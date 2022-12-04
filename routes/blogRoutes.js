const express = require("express")
const router = express.Router()
const Blog = require("../models/blogModel")

router.get("/", async (req,res) => {
    const blogs = await Blog.find().sort({
        createdAt: 'desc'
    })
    res.render('blogs', { blogs: blogs})
})

router.get("/newblog", (req,res) => {
    const blog = new Blog
    res.render('newblog', { blog: blog})
})

router.post("/", async (req, res) => {
    let blog = new Blog({
        author: req.body.author,
        title: req.body.title,
        blogtext: req.body.blogtext,
    })
    try {
        blog = await blog.save()
        res.redirect(`/blogs`)
    } catch (e) {
        res.render("blogs/newblog")
        console.log(e)
    }
})


router.get("/edit/:id", async (req,res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('edit', { blog:blog })
})
  
  router.put('/:id', async (req, res, ) => {
    let blog = await Blog.findOneAndUpdate(req.params.id)
    blog.author = req.body.author
    blog.title = req.body.title
    blog.blogtext = req.body.blogtext
    try {
        blog = await blog.save()
        res.redirect(`/blogs`)
    } catch (e) {
        res.render(`blogs/edit/:${blog.id}`)
        console.log(e)
    }
  })

router.delete('/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/blogs')
})

module.exports = router