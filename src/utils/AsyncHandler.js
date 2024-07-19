//taking a fun as param. , using promise
const asyncHandler=(requestHandler)=>{
    //promise has error,req,res,next(for next time usage)
    (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error));
    }
}

export {asyncHandler};