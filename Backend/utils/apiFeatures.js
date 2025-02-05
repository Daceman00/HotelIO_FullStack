class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // Merge filter conditions (e.g., ?role=user)
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Merge parsed filters into this.filters
        this.filters = { ...this.filters, ...JSON.parse(queryStr) };
        return this;
    }

    // Add search conditions (e.g., ?search=joh)
    search(searchFields) {
        if (this.queryString.search) {
            const searchTerm = this.queryString.search.trim();

            if (searchTerm.length < 3) {
                throw new Error('Search term must be at least 3 characters.');
            }

            const escapedSearchTerm = searchTerm.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const regex = new RegExp(escapedSearchTerm, "i"); // Case-insensitive regex
            const orConditions = searchFields.map(field => ({
                [field]: { $regex: regex }
            }));

            // Merge $or into this.filters
            this.filters.$or = orConditions;
        }
        return this;
    }

    // Apply all accumulated filters in one .find()
    applyFilters() {
        this.query = this.query.find(this.filters);
        return this;
    }
    sort() {

        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;;
    }

    limitFields() {

        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {

        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page * limit) - limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;