import { Chapter } from "@/components/Chapter";
import { StreamList } from "@/components/Stream";

export const metadata = { title: "Stream of Thoughts" };

export default function StreamOfThoughts() {
  return (
    <Chapter href="/stream/" wide>
      <StreamList />
    </Chapter>
  );
}
