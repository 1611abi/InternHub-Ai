const Resource = require('../models/careervault/Resource');
const Folder = require('../models/careervault/Folder');
const SavedResource = require('../models/careervault/SavedResource');
const ResourceReport = require('../models/careervault/ResourceReport');
const { validationResult } = require('express-validator');

// @desc    Get resources with pagination, sorting, filtering
// @route   GET /api/careervault/resources
// @access  Public
const getResources = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const query = { status: 'Approved' };

        if (req.query.difficulty) {
            query.difficulty = req.query.difficulty;
        }
        if (req.query.field && req.query.field !== 'All') {
            query.field = req.query.field;
        }
        if (req.query.type && req.query.type !== 'All') {
            query.type = req.query.type;
        }

        let sortOption = { createdAt: -1 };
        if (req.query.sort === 'trending') {
            sortOption = { upvotes: -1, savesCount: -1 };
        } else if (req.query.sort === 'most-saved') {
            sortOption = { savesCount: -1 };
        } else if (req.query.sort === 'popular') {
            sortOption = { upvotes: -1 };
        } else if (req.query.sort === 'top-rated') {
            sortOption = { averageRating: -1 };
        }

        const resources = await Resource.find(query)
            .sort(sortOption)
            .skip(startIndex)
            .limit(limit)
            .populate('uploadedBy', 'name')
            .lean();

        const total = await Resource.countDocuments(query);

        res.json({
            success: true,
            count: resources.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: resources
        });
    } catch (error) {
        console.error('getResources Error:', error);
        res.status(500).json({ message: 'Server error fetching resources' });
    }
};

// @desc    Get single resource
// @route   GET /api/careervault/resources/:id
// @access  Public
const getResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate('uploadedBy', 'name')
            .lean();

        if (!resource || resource.status !== 'Approved') {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.json({ success: true, data: resource });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching resource' });
    }
};

// @desc    Search resources
// @route   GET /api/careervault/search?q=
// @access  Public
const searchResources = async (req, res) => {
    try {
        const q = req.query.q;
        if (!q) {
            return res.status(400).json({ message: 'Search query required' });
        }

        const resources = await Resource.find(
            { $text: { $search: q }, status: 'Approved' },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(20)
            .populate('uploadedBy', 'name')
            .lean();

        res.json({ success: true, count: resources.length, data: resources });
    } catch (error) {
        res.status(500).json({ message: 'Server error searching resources' });
    }
};

// @desc    Get resources by field
// @route   GET /api/careervault/field/:field
// @access  Public
const getByField = async (req, res) => {
    try {
        const resources = await Resource.find({ field: req.params.field, status: 'Approved' })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('uploadedBy', 'name')
            .lean();

        res.json({ success: true, count: resources.length, data: resources });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching by field' });
    }
};

// @desc    Create new resource
// @route   POST /api/careervault/resources
// @access  Private
const createResource = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, type, field, difficulty, url, tags } = req.body;

        let filePath = '';
        if (req.file) {
            filePath = `/uploads/careervault/${req.file.filename}`;
        }

        // Auto approve if admin, else pending
        const status = req.user.role === 'admin' ? 'Approved' : 'Pending';

        const resource = await Resource.create({
            title,
            description,
            type,
            field,
            difficulty,
            url,
            filePath,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            uploadedBy: req.user._id,
            status
        });

        res.status(201).json({ success: true, data: resource, message: status === 'Approved' ? 'Created' : 'Pending approval' });
    } catch (error) {
        res.status(500).json({ message: 'Server error creating resource' });
    }
};

// @desc    Update resource
// @route   PUT /api/careervault/resources/:id
// @access  Private
const updateResource = async (req, res) => {
    try {
        let resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this resource' });
        }

        resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: resource });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating resource' });
    }
};

// @desc    Delete resource
// @route   DELETE /api/careervault/resources/:id
// @access  Private
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this resource' });
        }

        await resource.deleteOne();
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting resource' });
    }
};

// @desc    Upvote resource
// @route   POST /api/careervault/resources/:id/upvote
// @access  Private
const upvoteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });

        if (resource.upvotedUsers.includes(req.user._id)) {
            // Remove upvote
            resource.upvotedUsers = resource.upvotedUsers.filter(id => id.toString() !== req.user._id.toString());
            resource.upvotes -= 1;
            await resource.save();
            return res.json({ success: true, message: 'Upvote removed', upvotes: resource.upvotes });
        } else {
            // Add upvote
            resource.upvotedUsers.push(req.user._id);
            resource.upvotes += 1;
            await resource.save();
            return res.json({ success: true, message: 'Upvoted', upvotes: resource.upvotes });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error upvoting resource' });
    }
};

// @desc    Save/Bookmark resource
// @route   POST /api/careervault/resources/:id/save
// @access  Private
const saveResource = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const userId = req.user._id;

        const existingSave = await SavedResource.findOne({ userId, resourceId });

        if (existingSave) {
            // Unsave
            await existingSave.deleteOne();
            await Resource.findByIdAndUpdate(resourceId, { $inc: { savesCount: -1 } });
            return res.json({ success: true, message: 'Resource unsaved' });
        } else {
            // Save
            await SavedResource.create({ userId, resourceId });
            await Resource.findByIdAndUpdate(resourceId, { $inc: { savesCount: 1 } });
            return res.status(201).json({ success: true, message: 'Resource saved' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error saving resource' });
    }
};

// @desc    Rate resource
// @route   POST /api/careervault/resources/:id/rate
// @access  Private
const rateResource = async (req, res) => {
    try {
        const { value } = req.body;
        if (!value || value < 1 || value > 5) {
            return res.status(400).json({ message: 'Valid rating value (1-5) is required' });
        }

        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });

        const existingRatingIndex = resource.ratings.findIndex(r => r.userId.toString() === req.user._id.toString());

        if (existingRatingIndex >= 0) {
            resource.ratings[existingRatingIndex].value = value;
        } else {
            resource.ratings.push({ userId: req.user._id, value });
        }

        await resource.save();
        await Resource.calculateAverageRating(resource._id);

        res.json({ success: true, message: 'Resource rated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error rating resource' });
    }
};

// @desc    Report resource
// @route   POST /api/careervault/resources/:id/report
// @access  Private
const reportResource = async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason) return res.status(400).json({ message: 'Reason required for report' });

        await ResourceReport.create({
            resourceId: req.params.id,
            reportedBy: req.user._id,
            reason
        });

        res.status(201).json({ success: true, message: 'Report submitted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error reporting resource' });
    }
};

// ─── Folders (Structured Learning Paths) ───

const createFolder = async (req, res) => {
    try {
        const { folderName, description, field, resourceIds } = req.body;
        const folder = await Folder.create({
            folderName,
            description,
            field,
            resourceIds: resourceIds || [],
            createdBy: req.user._id
        });
        res.status(201).json({ success: true, data: folder });
    } catch (error) {
        res.status(500).json({ message: 'Error creating folder' });
    }
};

const getFolders = async (req, res) => {
    try {
        const folders = await Folder.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ success: true, data: folders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching folders' });
    }
};

const getFolder = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id)
            .populate('createdBy', 'name')
            .populate({
                path: 'resourceIds',
                match: { status: 'Approved' }
            })
            .lean();
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        res.json({ success: true, data: folder });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching folder' });
    }
};

const addResourceToFolder = async (req, res) => {
    try {
        const { resourceId } = req.body;
        if (!resourceId) return res.status(400).json({ message: 'resourceId is required' });

        const folder = await Folder.findById(req.params.id);
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        
        if (folder.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to modify this folder' });
        }

        if (!folder.resourceIds.includes(resourceId)) {
            folder.resourceIds.push(resourceId);
            await folder.save();
        }
        res.json({ success: true, message: 'Resource added to folder', data: folder });
    } catch (error) {
        res.status(500).json({ message: 'Error adding resource to folder' });
    }
};

const deleteFolder = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id);
        if (!folder) return res.status(404).json({ message: 'Folder not found' });

        if (folder.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this folder' });
        }

        await folder.deleteOne();
        res.json({ success: true, message: 'Folder deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting folder' });
    }
};

// ─── Admin Routes ───

const getPendingResources = async (req, res) => {
    try {
        const pending = await Resource.find({ status: 'Pending' }).populate('uploadedBy', 'name');
        res.json({ success: true, data: pending });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending resources' });
    }
};

const approveResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
        res.json({ success: true, data: resource });
    } catch (error) {
        res.status(500).json({ message: 'Error approving resource' });
    }
};

const rejectResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });
        res.json({ success: true, message: 'Resource rejected', data: resource });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting resource' });
    }
};

module.exports = {
    getResources,
    getResource,
    searchResources,
    getByField,
    createResource,
    updateResource,
    deleteResource,
    upvoteResource,
    saveResource,
    rateResource,
    reportResource,
    createFolder,
    getFolders,
    getFolder,
    addResourceToFolder,
    deleteFolder,
    getPendingResources,
    approveResource,
    rejectResource
};
