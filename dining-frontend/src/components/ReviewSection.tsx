import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types/restaurant';
import { format } from 'date-fns';

interface ReviewSectionProps {
  reviews: Review[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  return (
    <div className="space-y-8">
      {reviews.map(review => (
        <div key={review.id} className="border-b border-gray-200 pb-8">
          <div className="flex items-start">
            <img
              src={review.userImage}
              alt={review.userName}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{review.userName}</h4>
                <span className="text-sm text-gray-500">
                  {format(new Date(review.date), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};