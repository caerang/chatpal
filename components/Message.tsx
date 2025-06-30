
import React, { useCallback } from 'react';
import { Message as MessageType } from '../types';
import { ShareIcon } from './Icons';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { sender, text, correction, originalText } = message;
  const isUser = sender === 'user';

  const handleShare = useCallback(() => {
    if (!correction || !originalText) return;

    const shareText = `I learned a new English tip on ChatPal! 💡\n\nInstead of: "${originalText}"\nSay: "${correction}"\n\n#EnglishPractice #ChatPal`;
    
    if (navigator.share) {
      navigator.share({
        title: 'English Tip from ChatPal',
        text: shareText,
      }).catch(() => {
        // Fallback to clipboard if share fails
        navigator.clipboard.writeText(shareText);
        alert('Tip copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Tip copied to clipboard!');
    }
  }, [correction, originalText]);

  const messageBubbleClasses = isUser
    ? 'bg-blue-600 text-white rounded-br-none'
    : 'bg-gray-700 text-gray-200 rounded-bl-none';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-lg lg:max-w-xl`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-md ${messageBubbleClasses}`}
        >
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
        {correction && (
          <div className="relative mt-2 p-3 bg-gray-800 border border-yellow-500/30 rounded-lg text-sm text-yellow-200">
            <p><span className="font-semibold text-yellow-300">✨ A better way to say that:</span> {correction}</p>
            <button 
              onClick={handleShare} 
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Share this tip"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
