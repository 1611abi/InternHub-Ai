const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    folderName: { type: String, required: true },
    description: { type: String },
    field: { type: String, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resourceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    totalSaves: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
}, {
    timestamps: true
});

FolderSchema.index({ field: 1 });
FolderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Folder', FolderSchema);
