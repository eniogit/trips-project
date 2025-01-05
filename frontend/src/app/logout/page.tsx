import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  async function logout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("jwt");
    return redirect("/login");
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={logout}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto w-fit"
      >
        Logout
      </button>
    </div>
  );
}
