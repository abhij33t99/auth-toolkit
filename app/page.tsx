import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-c-green to-c-green-l">
      <div
        className="space-y-6 text-center
      "
      >
        <h1 className="text-7xl font-semibold  drop-shadow-lg">
          Auth-Toolkit <span className="text-c-purple">🛠</span>
        </h1>
        <p className="p-4">A complete auth service built with NextJs!</p>
        <LoginButton asChild>
          <Button>Sign In</Button>
        </LoginButton>
      </div>
    </main>
  );
}
