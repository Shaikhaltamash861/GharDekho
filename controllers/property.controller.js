
const Property = require("../models/property.model");

const addProperty = async (req, res) => {
    try {
        const property = new Property({ ...req.body, ownerId: req.user.id });
        await property.save();
        res.status(201).json(property);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

// 👉 Get All Properties (List)
const getAllProperties = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "desc",
            city,
            state,
            propertyType,
            minPrice,
            maxPrice,
            bedrooms
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        // 📌 Filters
        const filter = {};
        if (city) filter["address.city"] = city;
        if (state) filter["address.state"] = state;
        if (propertyType) filter.propertyType = propertyType;
        if (bedrooms) filter.bedrooms = parseInt(bedrooms);
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }

        // 📌 Total count for pagination
        const total = await Property.countDocuments(filter);

        // 📌 Sort
        const sortOptions = {};
        sortOptions[sortBy] = order === "asc" ? 1 : -1;

        // 📌 Query with pagination
        const properties = await Property.find(filter)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("ownerId", "name email");

        res.json({
            total,
            page,
            pages: Math.ceil(total / limit),
            properties
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 👉 Get Single Property (Details Page)
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate("ownerId", "name email");
        if (!property) return res.status(404).json({ error: "Property not found" });
        res.json(property);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 👉 Update Property (Owner only)

const updateProperty = async (req, res) => {
    try {
        const property = await Property.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            req.body,
            { new: true }
        );
        if (!property) return res.status(404).json({ error: "Not authorized or property not found" });
        res.json(property);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

};

// 👉 Delete Property (Owner only)
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!property) return res.status(404).json({ error: "Not authorized or property not found" });
        res.json({ message: "Property deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    addProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
};
