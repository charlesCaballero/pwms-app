import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./Login";

const queryClient = new QueryClient();

export default function Auth() {
  return (
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );
}
