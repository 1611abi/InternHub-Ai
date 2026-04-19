import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value, max = 5, onRate, readonly = false, size = 16 }) => {
    return (
        <div className="flex gap-1" style={{ width: 'fit-content' }}>
            {[...Array(max)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => !readonly && onRate && onRate(starValue)}
                        disabled={readonly}
                        className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                    >
                        <Star
                            size={size}
                            className={starValue <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default Rating;
