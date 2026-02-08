import React, { useEffect, useState } from 'react';
import {
  Text, Heading1, Heading2, Heading3, List, ListOrdered,
  CheckSquare, ChevronsDownUp, Quote, Minus, Megaphone,
  Image, Video, Headphones, File, Code, Bookmark, Sigma,
  FileText, Table, Link,
  Command as CommandIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'text': <Text size={16} />,
  'heading-1': <Heading1 size={16} />,
  'heading-2': <Heading2 size={16} />,
  'heading-3': <Heading3 size={16} />,
  'list': <List size={16} />,
  'list-ordered': <ListOrdered size={16} />,
  'check-square': <CheckSquare size={16} />,
  'chevrons-down-up': <ChevronsDownUp size={16} />,
  'text-quote': <Quote size={16} />,
  'minus': <Minus size={16} />,
  'megaphone': <Megaphone size={16} />,
  'image': <Image size={16} />,
  'video': <Video size={16} />,
  'headphones': <Headphones size={16} />,
  'file': <File size={16} />,
  'code': <Code size={16} />,
  'bookmark': <Bookmark size={16} />,
  'sigma': <Sigma size={16} />,
  'file-text': <FileText size={16} />,
  'table': <Table size={16} />,
  'link': <Link size={16} />,
};

interface SlashMenuProps {
  query: string;
  onSelect: (title: string) => void;
}

export const SlashMenu = ({ query, onSelect }: SlashMenuProps) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/commands?q=${query}`);
        const data = await response.json();
        setGroups(data.groups);
        setSelectedIndex(0); 
      } catch (error) {
        console.error("Failed to fetch commands:", error);
      }
    };
    fetchCommands();
  }, [query]);

  const allCommands = groups.flatMap((g) => g.commands);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allCommands.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % allCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + allCommands.length) % allCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = allCommands[selectedIndex];
        if (selected) onSelect(selected.title);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allCommands, selectedIndex, onSelect]);

  return (
    <div className="notion-menu">
      {groups.length === 0 && <div className="notion-menu-empty">No results found</div>}

      {groups.map((group) => (
        <div key={group.category}>
          <div className="notion-menu-group">{group.category}</div>
          {group.commands.map((cmd: any) => {
            const currentGlobalIndex = allCommands.findIndex((c) => c.id === cmd.id);
            const isSelected = currentGlobalIndex === selectedIndex;

            return (
              <button
                key={cmd.id}
                onClick={() => onSelect(cmd.title)}
                className={cn('notion-menu-item', isSelected && 'is-selected')}
              >
                <div className="notion-menu-icon">
                  {ICON_MAP[cmd.icon] || <CommandIcon size={16} />}
                </div>
                <div className="notion-menu-text">
                  <span className="notion-menu-title">{cmd.title}</span>
                  <span className="notion-menu-desc">{cmd.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
