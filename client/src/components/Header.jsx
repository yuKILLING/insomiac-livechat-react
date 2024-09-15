import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky z-10 top-0 w-full border-b p-2 text-xl">
      <ul className="flex justify-around">
        <Link className="font-bold cursor-pointer" to={"/chat"}>Insomiac</Link>
        <Link className="cursor-pointer" to={"/login"}>Login</Link>
      </ul>
    </header>
  );
}
