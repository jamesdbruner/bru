import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '../utils/copyToClipboard.ts';

interface CopyButtonProps {
  textToCopy: string;
  notify: (name: string) => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({ notify, textToCopy }) => {

  const handleCopy = () => {
    copyToClipboard(textToCopy);
    notify('Copying results to clipboard');
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center px-3 py-2 rounded-md text-white bg-transparent hover:bg-slate-800 border-1 border-white"
      title="Copy to clipboard"
    >
      <span className="inline mr-2 text-sm font-semibold">Copy</span> <ClipboardDocumentIcon className="h-5 w-5" />
    </button>
  );
};

export default CopyButton;