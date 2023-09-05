import { useWaku } from "@waku/react";
import { Home } from "./page/Home";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { isLoading, error } = useWaku();

  useEffect(() => {
    if (error && !isLoading) {
      toast("Error loading with waku");
    }
  }, [error, isLoading]);

  return (
    <>
      {isLoading && (
        <p className="text-sm flex justify-center items-center h-screen">
          Connecting to Waku...
        </p>
      )}
      {!isLoading && !error && <Home />}
      <Toaster />
    </>
  );
}

export default App;
