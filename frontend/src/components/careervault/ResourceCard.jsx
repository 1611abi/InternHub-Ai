import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, FileText, BookOpen, Map, ArrowUpCircle, Bookmark, Star, ArrowUp, Github } from 'lucide-react';
import careervaultApi from '../../services/careervaultApi';

const TYPE_CONFIG = {
    youtube: { icon: <Youtube size={16} />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'YouTube' },
    course: { icon: <BookOpen size={16} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Course' },
    notes: { icon: <FileText size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'PDF Notes' },
    roadmap: { icon: <Map size={16} />, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', label: 'Roadmap' },
    github: { icon: <Github size={16} />, color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300', label: 'GitHub' },
};

const DIFFICULTY_COLORS = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-rose-100 text-rose-700'
};

const ResourceCard = ({ resource, onUpvoteChange, onSaveChange }) => {
    // Optimistic state updates
    const [upvotes, setUpvotes] = useState(resource.upvotes);
    const [isSaved, setIsSaved] = useState(false); // Can infer from props if user previously saved
    const [isUpvoted, setIsUpvoted] = useState(false); // Can infer from props if upvotedUsers includes current user ID

    const config = TYPE_CONFIG[resource.type] || TYPE_CONFIG.course;

    const handleUpvote = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await careervaultApi.upvote(resource._id);
            if (res.data.success) {
                setUpvotes(res.data.upvotes);
                setIsUpvoted(!isUpvoted);
                if (onUpvoteChange) onUpvoteChange(resource._id, res.data.upvotes);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await careervaultApi.save(resource._id);
            if (res.data.success) {
                setIsSaved(!isSaved);
                if (onSaveChange) onSaveChange(resource._id, !isSaved);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Link
            to={`/careervault/resource/${resource._id}`}
            className="block group bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border ${config.bg} ${config.color} ${config.border}`}>
                    {config.icon} {config.label}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className={`p-2 rounded-xl transition-all ${isSaved ? 'text-blue-600 bg-blue-50 shadow-sm' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                        title="Save for later"
                    >
                        <Bookmark size={20} className={isSaved ? 'fill-blue-600' : ''} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {resource.title}
            </h3>

            <p className="text-base text-slate-500 mb-5 line-clamp-2 leading-relaxed flex-1">
                {resource.description || 'No description provided.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-5 mt-auto">
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                    {resource.field}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md ${DIFFICULTY_COLORS[resource.difficulty]}`}>
                    {resource.difficulty}
                </span>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-slate-100/80 text-sm">
                <div className="flex items-center gap-5 text-slate-500 font-semibold">
                    <button
                        onClick={handleUpvote}
                        className={`flex items-center gap-1.5 hover:text-slate-800 transition-all bg-slate-50 px-2 py-1 rounded-md hover:bg-slate-100 ${isUpvoted ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : ''}`}
                    >
                        <ArrowUp size={16} strokeWidth={isUpvoted ? 3 : 2} /> {upvotes}
                    </button>
                    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        {resource.averageRating > 0 ? resource.averageRating.toFixed(1) : 'New'}
                    </div>
                </div>
                <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    By <span className="text-slate-600 truncate max-w-[80px]">{resource.uploadedBy?.name || 'Anonymous'}</span>
                </div>
            </div>
        </Link>
    );
};

export default ResourceCard;
