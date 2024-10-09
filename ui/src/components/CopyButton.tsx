import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '../utils/copyToClipboard.ts';
import { useHotkeys } from 'react-hotkeys-hook';

interface CopyButtonProps {
  textToCopy: string;
  notify: (name: string) => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({ notify, textToCopy }) => {

  const handleCopy = () => {
    copyToClipboard(textToCopy);
    notify('✅ Copied to clipboard');
  }

  useHotkeys('alt+c', () => handleCopy());

  return (
    <button
      onClick={handleCopy}
      className="relative inline-flex items-center px-3 py-2 rounded-md text-white bg-transparent hover:bg-slate-800 border-1 border-white group outline-none"
      title="Copy to clipboard"
    >
      <span className="inline mr-2 text-sm font-semibold">Copy</span> <ClipboardDocumentIcon className="h-5 w-5" />
      <span className="bg-black p-2 rounded-lg text-xs pointer-events-none absolute z-20 -top-9 right-9 w-max opacity-0 transition-opacity group-focus:opacity-100 group-hover:opacity-100">
        ⌥ + c
      </span>
    </button>
  );
};

export default CopyButton;