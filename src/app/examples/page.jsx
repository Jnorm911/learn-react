import Link from "next/link";

export default function ExamplesIndex() {
  return (
    <main>
      <h1>Examples</h1>
      <ul>
        <li><Link href="/examples/arrays">Arrays</Link></li>
        <li><Link href="/examples/local-storage">Local Storage</Link></li>
        <li><Link href="/examples/sorting">Sorting</Link></li>
        <li><Link href="/examples/state-checkbox">State Checkbox</Link></li>
      </ul>
    </main>
  );
}