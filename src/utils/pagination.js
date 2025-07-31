const paginate = async (model, req) => {
    // Extract page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    try {
        // Get total count of documents
        const total = await model.countDocuments();
        
        // Fetch paginated results
        const results = await model.find().skip(skip).limit(limit);
        
        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        
        return {
            results,
         
                currentPage: page,
                totalPages,
                totalResults: total,
                resultsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
          
        };
    } catch (error) {
        throw new Error(`Pagination error: ${error.message}`);
    }
};

export  {paginate};