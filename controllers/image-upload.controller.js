const { cloudinary, uploadToCloudinary } = require("../configs/cloudinary");
const uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No files uploaded" });
        }

        const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
        const results = await Promise.all(uploadPromises);

        const imageUrls = results.map((r) => r.secure_url);
        res.status(200).json({ success: true, imageUrls }); 
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = { uploadImages };