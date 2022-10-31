import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { OutputData } from "@editorjs/editorjs";
import { Editor } from "./components/Editor";
import { SpinnerIcon } from "./components/SpinnerIcon";
import { DefaultClient } from "./services/client";

export function ContentPage() {
  const { id } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [initialValue, setInitialValue] = useState<OutputData | undefined>();

  useEffect(() => {
    async function work() {
      setLoading(true);
      try {
        const resp = await DefaultClient.API.notebookGetSharedData({
          gistId: id!,
        });
        const data = JSON.parse(resp.data.data);
        setInitialValue(data);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      work();
    } else {
      setLoading(false);
    }
  }, [id]);

  return (
    <div className="bg-slate-100">
      <div className="w-[1150px] mx-auto">
        <div className="pt-16 w-[850px] bg-white shadow-xl min-h-screen">
          {isLoading && (
            <div className="w-[650px] mx-auto">
              <div className="flex items-center">
                <SpinnerIcon className="mr-2 w-4 h-4 text-gray-200 animate-spin fill-rose-500" />
                <span className="text-gray-600">Loading notebook...</span>
              </div>
            </div>
          )}
          {!isLoading && <Editor defaultValue={initialValue} />}
        </div>
      </div>
    </div>
  );
}

export default ContentPage;
