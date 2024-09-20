import { Link } from "react-router-dom";
import { useMain } from "@/store/main";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const { changeUserInfo, changeAuth, isAuth } = useMain();
  const navigate = useNavigate();
  function logOut() {
    changeAuth(false);
    changechangeUserInfoAuth({});
    navigate("/login");
  }
  return (
    <header className="sticky z-10 top-0 w-full border-b p-2 text-xl bg-white">
      <ul className="flex justify-around">
        <Link className="font-bold cursor-pointer" to={"/chat"}>
          Insomiac
        </Link>
        {!isAuth && (
          <Link className="cursor-pointer" to={"/login"}>
            Login
          </Link>
        )}

        {isAuth && (
          <Link className="cursor-pointer" to={"/login"}>
            Log out
          </Link>
        )}
      </ul>
    </header>
  );
}
