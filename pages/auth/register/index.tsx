import { QueryClient, QueryClientProvider } from "react-query";
import Register from "./Register";

const queryClient = new QueryClient();

export default function Auth() {
  return (
    <QueryClientProvider client={queryClient}>
      <Register />
    </QueryClientProvider>
  );
}
