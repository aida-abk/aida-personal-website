import { Chapter } from "@/components/Chapter";
import { TrajectoryList } from "@/components/TrajectoryList";

export const metadata = { title: "Trajectory" };

export default function Trajectory() {
  return (
    <Chapter href="/trajectory/">
      <TrajectoryList />
    </Chapter>
  );
}
