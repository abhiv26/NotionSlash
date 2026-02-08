import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SlashMenu } from './SlashMenu';

export const Editor = () => {
  const [content, setContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [triggerIndex, setTriggerIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const getCaretCoordinates = useCallback((textarea: HTMLTextAreaElement, position: number) => {
    const div = document.createElement('div');
    const style = window.getComputedStyle(textarea);
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.font = style.font;
    div.style.padding = style.padding;
    div.style.border = style.border;
    div.style.boxSizing = style.boxSizing;
    div.style.lineHeight = style.lineHeight;
    div.style.width = style.width;
    div.style.overflow = 'auto';

    const text = textarea.value.substring(0, position);
    div.textContent = text;

    const span = document.createElement('span');
    span.textContent = '\u200b';
    div.appendChild(span);

    document.body.appendChild(div);
    const { offsetLeft, offsetTop } = span;
    document.body.removeChild(div);

    return { left: offsetLeft, top: offsetTop };
  }, []);

  const updateMenuPosition = useCallback(() => {
    const textarea = textareaRef.current;
    const container = containerRef.current;
    if (!textarea || !container) return;

    const caret = textarea.selectionStart ?? 0;
    const caretCoords = getCaretCoordinates(textarea, caret);
    const textareaRect = textarea.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const x = textareaRect.left - containerRect.left + caretCoords.left - 6;
    const menuHeight = menuRef.current?.offsetHeight ?? 360;
    const caretTop = textareaRect.top - containerRect.top + caretCoords.top;
    const aboveY = caretTop - menuHeight - 10;
    const belowY = caretTop + 28;

    const minTop = 8;
    const maxTop = containerRect.height - menuHeight - 8;
    const y = aboveY < minTop ? Math.min(belowY, maxTop) : aboveY;

    setMenuPosition({ x, y });
  }, [getCaretCoordinates]);

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
        updateMenuPosition();
        return;
      }
    }

    setShowMenu(false);
    setTriggerIndex(null);
  };

  const handleSelectionChange = () => {
    if (!showMenu) return;
    updateMenuPosition();
  };

  useEffect(() => {
    if (!showMenu) return;
    document.addEventListener('selectionchange', handleSelectionChange);
    window.addEventListener('resize', handleSelectionChange);
    window.addEventListener('scroll', handleSelectionChange, true);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      window.removeEventListener('resize', handleSelectionChange);
      window.removeEventListener('scroll', handleSelectionChange, true);
    };
  }, [showMenu, updateMenuPosition]);

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
    <div className="min-h-screen bg-[#fbfbfa]">
      <div className="notion-page" ref={containerRef}>
        <div className="notion-hint">Type / for commands</div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          placeholder="Start writing..."
          className="notion-textarea"
          autoFocus
          spellCheck
          onClick={handleSelectionChange}
          onKeyUp={handleSelectionChange}
        />

        {showMenu && (
          <div
            ref={menuRef}
            className="notion-menu-anchor"
            style={{ left: menuPosition.x, top: menuPosition.y }}
          >
            <SlashMenu query={query} onSelect={handleSelectCommand} />
          </div>
        )}
      </div>
    </div>
  );
};
