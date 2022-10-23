import { MantineProvider } from "@mantine/core";
import { Root } from "@/components/Root";
import { OutputData } from "@editorjs/editorjs";
import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useParams,
} from "react-router-dom";
import { Editor } from "./components/Editor";
import {
  EditorContext,
  EditorInstanceContainer,
} from "./components/Editor/Context";
import { SpinnerIcon } from "./components/SpinnerIcon";
import { Nav } from "./layout/Nav";
import { DefaultClient } from "./services/client";
import { PlaygroundPage } from "./Playground";
import { QueryClient, QueryClientProvider } from "react-query";
import { CollectionsPage } from "./components/Collections";

function ContentPage() {
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

const queryClient = new QueryClient();

export default function App() {
  // A globally available editor.js instance
  const editorContainer = useRef<EditorInstanceContainer>({
    instance: undefined,
  });

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ defaultRadius: "lg" }}
    >
      <QueryClientProvider client={queryClient}>
        <EditorContext.Provider value={editorContainer.current}>
          <Router>
            <Root>
              <div className="h-screen">
                <Nav />
                <Routes>
                  <Route path="/create" element={<ContentPage />} />
                  <Route path="/gist/:id" element={<ContentPage />} />
                  <Route path="/playground" element={<PlaygroundPage />} />
                  <Route
                    path="/collections"
                    element={<CollectionsPage />}
                  ></Route>
                  <Route
                    path="*"
                    element={<Navigate to="/create" replace></Navigate>}
                  />
                </Routes>
              </div>
            </Root>
          </Router>
        </EditorContext.Provider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
