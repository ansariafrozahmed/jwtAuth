import LoginForm from "@/components/LoginForm";
import { Button } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex gap-5 py-5">
        <Link href={"/profile"}>
          <Button type="primary">PROFILE</Button>
        </Link>
        <Link href={"/dashboard"}>
          <Button type="primary">DASHBOARD</Button>
        </Link>
      </div>
      <LoginForm />
    </main>
  );
}
