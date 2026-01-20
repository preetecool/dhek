import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="font-semibold text-3xl">Dhek</h1>
      <div className="flex gap-4">
        <Button render={<Link href="/board" />} showArrow size="lg">
          Kanban
        </Button>
        <Button render={<Link href="/notepad" />} showArrow size="lg">
          Notepad
        </Button>
      </div>
    </div>
  );
}
