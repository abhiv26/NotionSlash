import React, { useRef, useState } from 'react';
import { SlashMenu } from './SlashMenu';

export const Editor = () => {
  const [content, setContent] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [triggerIndex, setTriggerIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    setContent(value);

    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    const charBeforeSlash = textBeforeCursor[lastSlashIndex - 1];
    const isValidTrigger =
      lastSlashIndex !== -1 &&
      (!charBeforeSlash || charBeforeSlash === ' ' || charBeforeSlash === '\n');

    if (isValidTrigger) {
      const textAfterSlash = textBeforeCursor.substring(lastSlashIndex + 1);
      if (!textAfterSlash.includes(' ')) {
        setQuery(textAfterSlash);
        setTriggerIndex(lastSlashIndex);
        setShowMenu(true);
        return;
      }
    }

    setShowMenu(false);
    setTriggerIndex(null);
  };

  const handleSelectCommand = (commandTitle: string) => {
    if (triggerIndex === null || !textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const before = content.substring(0, triggerIndex);
    const after = content.substring(cursorPosition);

    const newContent = `${before}[${commandTitle}] ${after}`;
    setContent(newContent);
    setShowMenu(false);

    const newCursorPos = before.length + commandTitle.length + 3;
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="max-w-3xl mx-auto mt-24 p-12 min-h-[70vh] relative">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleInput}
        placeholder="Type '/' for commands..."
        className="w-full h-full text-[#37352f] text-xl leading-relaxed outline-none resize-none bg-transparent placeholder-gray-300"
        autoFocus
      />

      {showMenu && (
        <div className="absolute top-24 left-12 z-50">
          <SlashMenu query={query} onSelect={handleSelectCommand} />
        </div>
      )}
    </div>
  );
};
