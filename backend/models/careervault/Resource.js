const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['youtube', 'course', 'roadmap', 'notes', 'github'],
        required: true
    },
    field: { type: String, required: true, index: true },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    url: { type: String }, // For youtube/course
    filePath: { type: String }, // For notes/roadmap PDF
    tags: [{ type: String, index: true }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    upvotes: { type: Number, default: 0 },
    upvotedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savesCount: { type: Number, default: 0 },
    ratings: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        value: { type: Number, min: 1, max: 5 }
    }],
    averageRating: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    }
}, {
    timestamps: true
});

// Indexes
ResourceSchema.index({ field: 1 });
ResourceSchema.index({ type: 1 });
ResourceSchema.index({ difficulty: 1 });
ResourceSchema.index({ status: 1 });
ResourceSchema.index({ createdAt: -1 });
ResourceSchema.index({ field: 1, type: 1 }); // Compound index
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text index

// Static method to calculate average rating
ResourceSchema.statics.calculateAverageRating = async function (resourceId) {
    const obj = await this.aggregate([
        { $match: { _id: resourceId } },
        { $unwind: '$ratings' },
        { $group: { _id: '$_id', averageRating: { $avg: '$ratings.value' } } }
    ]);

    try {
        await this.findByIdAndUpdate(resourceId, {
            averageRating: obj[0] ? obj[0].averageRating : 0
        });
    } catch (err) {
        console.error('Error calculating average rating:', err);
    }
};

module.exports = mongoose.model('Resource', ResourceSchema);
