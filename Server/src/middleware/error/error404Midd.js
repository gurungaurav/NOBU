

const error404Midd=(req,res,next)=>{

    throw {status:404,message:'Api or route not found!!'}

}

    // res.status(404).json({error:'Api or route not found!!'}) }

module.exports = error404Midd