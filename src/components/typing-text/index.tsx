import React, { useEffect, useState } from 'react';

interface TypingTextProps {
    text: string;
    speed?: number; // speed in milliseconds between each character
    onComplete?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 100, onComplete }) => {
    const [displayedText, setDisplayedText] = useState<string>('');

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, index + 1));
            index++;
            if (index === text.length) {
                clearInterval(interval);
                if (onComplete) {
                    onComplete();
                }
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, onComplete]);

    return <span>{displayedText}</span>;
};

export default TypingText;
