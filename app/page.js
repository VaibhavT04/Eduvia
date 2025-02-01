import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h2>Hello mic test 1 million, 2 million</h2>
      <Button variant="ghost">Checked</Button>

      <UserButton/>
    </div>
  );
}
