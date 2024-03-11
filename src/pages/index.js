import { TextComponent } from "@/components/text-component";
import json from "@/sample.json";

export default function Home() {
  return (
    <main className="container p-10">
      <h1>Hello</h1>
      <hr className="my-3" />
      <TextComponent text={json.text} />
    </main>
  );
}
