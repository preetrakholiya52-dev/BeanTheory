import React from 'react';

export const SplitText = ({ text }) => {
  return (
    <span aria-label={text} className="inline-block">
      {text.split('').map((char, index) => (
        <span 
          key={index} 
          aria-hidden="true" 
          className="inline-block intro-char"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export const SplitLines = ({ lines }) => {
  return (
    <div className="flex flex-col items-center">
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden leading-tight pb-2">
          <span className="inline-block intro-line origin-bottom">
            {line}
          </span>
        </div>
      ))}
    </div>
  );
};
