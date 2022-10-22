import copy from "copy-to-clipboard";
import { DefaultClient } from "@/services/client";
import { CopyIcon } from "@radix-ui/react-icons";
import { useCallback, useContext, useState } from "react";
import { IconButton } from "../Button";
import { EditorContext } from "../Editor/Context";
import { Input } from "../Input";
import Popover from "../Popover";
import { SpinnerIcon } from "../SpinnerIcon";
import { CheckCircleIcon } from "@heroicons/react/solid";

export interface INotebookSharePopProps {
  children?: React.ReactNode;
}

export function NotebookSharePop({ children }: INotebookSharePopProps) {
  const [isLoading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const copyLink = useCallback(() => {
    copy(shareLink);
    setIsCopied(true);
  }, [shareLink]);

  const editorContainer = useContext(EditorContext);
  return (
    <Popover
      title="Share Notebook"
      className="w-80"
      content={
        <div>
          {isLoading && (
            <div className="inline-flex items-center">
              <SpinnerIcon className="mr-2 w-4 h-4 text-gray-200 animate-spin fill-rose-500" />
              Generating share link...
            </div>
          )}
          {!isLoading && (
            <div className="flex items-center">
              <Input value={shareLink} className={"mr-2 flex-1"} />
              <IconButton onClick={copyLink}>
                <CopyIcon />
              </IconButton>
            </div>
          )}
          {isCopied && (
            <div className="bg-green-100 mt-2 rounded px-1.5 py-1.5 flex items-center text-green-800">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Copied to clipboard.
            </div>
          )}
        </div>
      }
      onOpenChange={async (open) => {
        if (!open) return;
        if (!editorContainer.instance) return;
        setLoading(true);
        setShareLink("");
        setIsCopied(false);
        const data = await editorContainer.instance.save();
        console.log("Editor data", data);
        try {
          const resp = await DefaultClient.API.notebookShare({
            data: JSON.stringify(data),
          });
          setShareLink(`${window.location.origin}/gist/${resp.data.gistId}`);
        } finally {
          setLoading(false);
        }
      }}
    >
      {children}
    </Popover>
  );
}
