import React from 'react';

export const UpArrowIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 11l7-7 7 7M12 18V4"></path>
    </svg>
);

export const DownArrowIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 13l-7 7-7-7m7 7V3"></path>
    </svg>
);

export const EyeOpenIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

export const EyeClosedIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.11 3.586-5.42 6.834-6.125M17.5 5.5a10.027 10.027 0 013.042 6.5C19.268 16.057 15.477 19 12 19a10.05 10.05 0 01-1.875-.175M2 2l20 20" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a2 2 0 01-2-2m0 0a2 2 0 012-2m0 2a2 2 0 00-2-2m2 2a2 2 0 002-2" />
    </svg>
);
