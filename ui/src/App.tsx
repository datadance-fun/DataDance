import { MantineProvider } from "@mantine/core";
import { Root } from "@/components/Root";
import { lazy, Suspense, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  EditorContext,
  EditorInstanceContainer,
} from "./components/Editor/Context";
import { Nav } from "./layout/Nav";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const ContentPage = lazy(() => import("./ContentPage"));
const PlaygroundPage = lazy(() => import("./Playground"));
const CollectionsPage = lazy(() => import("./components/Collections"));

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
                  <Route
                    path="/create"
                    element={
                      <Suspense fallback={<></>}>
                        <ContentPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/gist/:id"
                    element={
                      <Suspense fallback={<></>}>
                        <ContentPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/playground"
                    element={
                      <Suspense fallback={<></>}>
                        <PlaygroundPage />
                      </Suspense>
                    }
                  />
                  <Route path="/" element={<CollectionsPage />}></Route>
                  <Route
                    path="*"
                    element={<Navigate to="/" replace></Navigate>}
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
