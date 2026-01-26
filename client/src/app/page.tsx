import NavBar from "@/components/NavBar";
import LandingPage from "./(nondashboard)/landing/page";
import { NAVBAR_HEIGHT } from "@/lib/constants";

export default function Home() {
  return (
    <div className="h-full w-full ">
      <NavBar />

      <main
        className={`h-full flex w-full flex-col`}
        style={{
          paddingTop: `${NAVBAR_HEIGHT}px`,
        }}
      >
        <LandingPage />
      </main>
    </div>
  );
}
