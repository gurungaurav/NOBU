

class VendorValidatior{

    //? http://localhost:1000/api/nobu/vendor/addVendors/:user_id
    validateVendorRegistration=(schema)=>async(req,res,next)=>{
        try{
            await schema.validate({
                body:req.body,
                params: req.params
            })
            next()
        }catch(e){
            next(e)
        }
    }

    //? http://localhost:1000/api/nobu/vendor/addRooms/:hotel_id
    validateHotelRoomRegistration=(schema)=>async(req,res,next)=>{
        try{
            console.log(req.body,'heheh');
            await schema.validate({
                body: req.body,
                params: req.params
            })

            next()
        }catch(e){
            next(e)
        }
    }
}

const vendorValidator = new VendorValidatior();
module.exports = vendorValidator;