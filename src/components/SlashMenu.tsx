import React, { useEffect, useState } from 'react';
import {
  Text,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  ChevronsDownUp,
  Quote,
  Minus,
  Megaphone,
  Image,
  Video,
  Headphones,
  File,
  Code,
  Bookmark,
  Sigma,
  Command as CommandIcon,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ICON_MAP: Record<string, React.ReactNode> = {
  text: <Text size={16} />,
  'heading-1': <Heading1 size={16} />,
  'heading-2': <Heading2 size={16} />,
  'heading-3': <Heading3 size={16} />,
  list: <List size={16} />,
  'list-ordered': <ListOrdered size={16} />,
  'check-square': <CheckSquare size={16} />,
  'chevrons-down-up': <ChevronsDownUp size={16} />,
  'text-quote': <Quote size={16} />,
  minus: <Minus size={16} />,
  megaphone: <Megaphone size={16} />,
  image: <Image size={16} />,
  video: <Video size={16} />,
  headphones: <Headphones size={16} />,
  file: <File size={16} />,
  code: <Code size={16} />,
  bookmark: <Bookmark size={16} />,
  sigma: <Sigma size={16} />,
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
        console.error('Failed to fetch commands:', error);
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
    <div className="w-[320px] max-h-[450px] overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-xl p-1 font-sans">
      {groups.length === 0 && (
        <div className="px-3 py-2 text-sm text-gray-400">No results found</div>
      )}

      {groups.map((group) => (
        <div key={group.category}>
          <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {group.category}
          </div>
          {group.commands.map((cmd: any) => {
            const currentGlobalIndex = allCommands.findIndex((c) => c.id === cmd.id);
            const isSelected = currentGlobalIndex === selectedIndex;

            return (
              <button
                key={cmd.id}
                onClick={() => onSelect(cmd.title)}
                className={cn(
                  'w-full flex items-center px-2 py-1 gap-3 rounded-md transition-colors text-left',
                  isSelected ? 'bg-[#f1f1f0]' : 'hover:bg-[#f1f1f0]'
                )}
              >
                <div className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-lg text-gray-700 bg-white">
                  {ICON_MAP[cmd.icon] || <CommandIcon size={18} />}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[14px] font-medium text-[#37352f]">{cmd.title}</span>
                  <span className="text-[12px] text-gray-500 truncate">{cmd.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
