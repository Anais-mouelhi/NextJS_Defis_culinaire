import UserInfo from "../../components/UserInfo";
import LoginForm from "../../components/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main>
        <LoginForm />
      </main>
    );
  }

  return (
    <main>
      <UserInfo />
    </main>
  );
}
