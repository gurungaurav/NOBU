class BlogValidatior {
  //?http://localhost:1000/api/nobu/blog/postBlogs/:authorId
  validateBlogPost = (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
        params: req.params,
      });
      next();
    } catch (e) {
      next(e);
    }
  };
  //?http://localhost:1000/api/nobu/blog/blogCategories
  validateBlogCategories = (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
        // params:req.params
      });
      next();
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/blog/postBlogComments/:userId/:blogId
  validateBlogComments = (schema) => async (req, res, next) => {
    try {
      console.log(req.body);
      await schema.validate({
        body: req.body,
        params: req.params,
      });

      next();
    } catch (e) {
      next(e);
    }
  };

  validateBlogLikes = (schema)=>async(req,res,next)=>{
    try{
      await schema.validate({
        params:req.params
      });
      console.log(req.params);
      next()
    }catch(e){
      next(e)
    }
  }
}
const blogValidatior = new BlogValidatior();
module.exports = blogValidatior;
