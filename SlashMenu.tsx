import React, { useEffect, useState, useRef } from 'react';
import { Command as CommandIcon, Search, Text, Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, ChevronsDownUp, Quote, Minus, Megaphone, Image, Video, Headphones, File, Code, Bookmark, Sigma } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for Tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Icon mapping to match your Python id/icon fields
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

export const SlashMenu = () => {
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. Fetch data from your FastAPI backend
  useEffect(() => {
    fetch(`http://localhost:8000/api/commands?q=${query}`)
      .then(res => res.json())
      .then(data => {
        setGroups(data.groups);
        setSelectedIndex(0); // Reset selection on new search
      });
  }, [query]);

  // 2. Keyboard Navigation Logic
  const allCommands = groups.flatMap(g => g.commands);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => (prev + 1) % allCommands.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(prev => (prev - 1 + allCommands.length) % allCommands.length);
      e.preventDefault();
    } else if (e.key === "Enter") {
      const selected = allCommands[selectedIndex];
      if (selected) alert(`Selected: ${selected.title}`); // Replace with actual block insertion
      e.preventDefault();
    }
  };

  return (
    <div 
      ref={menuRef}
      className="w-[320px] max-h-[450px] overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-xl p-1 font-sans"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        {query ? "Results" : "Basic blocks"}
      </div>
      
      {groups.map((group) => (
        <div key={group.category}>
          {!query && <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-2">{group.category}</div>}
          {group.commands.map((cmd: any, idx: number) => {
            const absoluteIndex = allCommands.indexOf(cmd);
            const isSelected = absoluteIndex === selectedIndex;
            
            return (
              <button
                key={cmd.id}
                onClick={() => alert(`Selected: ${cmd.title}`)}
                className={cn(
                  "w-full flex items-center px-2 py-1 gap-3 rounded-md transition-colors text-left",
                  isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                )}
              >
                <div className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-500 bg-white">
                  {ICON_MAP[cmd.icon] || <CommandIcon size={16} />}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-gray-800">{cmd.title}</span>
                  <span className="text-xs text-gray-400 truncate">{cmd.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      ))}
      
      {allCommands.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-400">No results found</div>
      )}
    </div>
  );
};