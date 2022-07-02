import UserDetails from "@modules/users/UserDetails";
import { useRouter } from "next/router";

export default function User() {
  const router = useRouter();
  const { userId } = router.query;

  return <UserDetails userId={userId} />;
}
