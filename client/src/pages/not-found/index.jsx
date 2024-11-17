import { Navigate } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold">Looking for something?</h1>
      <p>
        We're sorry. The Web address you entered is not a functioning page on
        our site.
      </p>
      <p>
        ➡️Go to our{" "}
        <a className="font-bold text-orange-600 underline" href={"/home"}>
          Home
        </a>{" "}
        page
      </p>
    </div>
  );
}

export default NotFoundPage;
