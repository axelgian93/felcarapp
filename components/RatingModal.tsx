
import React, { useState } from 'react';
import { Star, X, MessageSquare } from 'lucide-react';
import { UserRole } from '../types';

interface RatingModalProps {
  subjectName: string;
  subjectPhoto: string;
  subjectRole: UserRole; // The role of the person BEING rated
  amount: string;
  onSubmit: (rating: number, tags: string[], comment: string) => void;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ 
  subjectName, 
  subjectPhoto, 
  subjectRole,
  amount, 
  onSubmit, 
  onClose 
}) => {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // Logic to get tags based on who we are rating
  const getTagsForRating = (stars: number) => {
    const isHighRating = stars >= 4;

    if (subjectRole === UserRole.DRIVER) {
      // We are rating a DRIVER (Rider's perspective)
      if (isHighRating) {
        return ['Conducción segura', 'Auto limpio', 'Amable', 'Ruta rápida', 'Aire Acondicionado'];
      } else {
        return ['Mala conducción', 'Auto sucio', 'Ruta incorrecta', 'Olor desagradable', 'Mala actitud', 'Música alta'];
      }
    } else {
      // We are rating a RIDER (Driver's perspective)
      if (isHighRating) {
        return ['Puntual', 'Amable', 'Respetuoso', 'Ubicación exacta', 'Buena conversación'];
      } else {
        return ['Hizo esperar', 'Portazo', 'Comió en el auto', 'Mala ubicación', 'Irrespetuoso', 'Solicitud extra'];
      }
    }
  };

  const tags = getTagsForRating(rating);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getTitle = () => {
    if (rating === 5) return "¡Excelente!";
    if (rating === 4) return "¡Muy bien!";
    if (rating === 3) return "Regular";
    if (rating === 2) return "Malo";
    return "¡Terrible!";
  };

  const handleSubmit = () => {
    onSubmit(rating, selectedTags, comment);
  };

  // Determine styling based on hovering or selection
  const getStarState = (index: number) => {
    const target = hoveredStar !== null ? hoveredStar : rating;
    return index <= target;
  };

  return (
    <div className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header Subject Info */}
        <div className="bg-gray-50 p-6 flex flex-col items-center border-b border-gray-100 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
          <div className="w-20 h-20 rounded-full p-1 bg-white shadow-lg mb-3">
            <img src={subjectPhoto} alt={subjectName} className="w-full h-full rounded-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{subjectName}</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            {subjectRole === UserRole.DRIVER ? 'Conductor' : 'Pasajero'}
          </p>
          <div className="mt-2 font-black text-2xl">{amount}</div>
        </div>

        {/* Rating Section */}
        <div className="p-6 text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-1 transition-all duration-300">{getTitle()}</h3>
            <p className="text-xs text-gray-400">Toca una estrella para calificar</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-3" onMouseLeave={() => setHoveredStar(null)}>
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = getStarState(star);
              return (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onClick={() => { setRating(star); setSelectedTags([]); }}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    size={36} 
                    // Always show gray stroke. Fill with Gold if active, otherwise Transparent.
                    className={`${isActive ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-gray-300'}`}
                    strokeWidth={isActive ? 0 : 1.5}
                  />
                </button>
              );
            })}
          </div>

          {/* Dynamic Tags */}
          <div className="flex flex-wrap justify-center gap-2 min-h-[60px]">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-black text-white border-black transform scale-105'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Comment Input */}
          <div className="relative">
            <MessageSquare size={16} className="absolute top-3 left-3 text-gray-400" />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Deja un comentario (opcional)..."
              className="w-full bg-gray-100 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              rows={2}
            />
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-800 transition transform active:scale-95"
          >
            Enviar Calificación
          </button>
        </div>

      </div>
    </div>
  );
};
