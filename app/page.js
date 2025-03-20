import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h2>Hello , Welcome to AI based LMS</h2>
      <Button variant="ghost">Checked</Button>

      <UserButton/>
    </div>
  );
}
