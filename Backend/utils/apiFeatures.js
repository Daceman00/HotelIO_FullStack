class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
        this.filters = {};
    }

    // Merge filter conditions (e.g., ?role=user)
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'status'];
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
                throw new Error('Search term must be at least 3 characters long.');
            }

            const escapedSearchTerm = searchTerm.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const regex = new RegExp(escapedSearchTerm, "i");
            const orConditions = [];

            searchFields.forEach(field => {
                if (field.includes('.')) {
                    const [populatedField, searchField] = field.split('.');
                    // Add both string and number matching conditions
                    orConditions.push({
                        [`${populatedField}.${searchField}`]: { $regex: regex }
                    });
                    if (!isNaN(searchTerm)) {
                        orConditions.push({
                            [`${populatedField}.${searchField}`]: parseInt(searchTerm)
                        });
                    }
                } else {
                    orConditions.push({ [field]: { $regex: regex } });
                }
            });

            this.filters.$or = orConditions;
        }
        return this;
    }

    mergeFilters(additionalFilters) {
        this.filters = { ...this.filters, ...additionalFilters };
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
            this.query = this.query.sort('-createdAt _id');
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
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;