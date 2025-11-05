import s from "./ErrorPage.module.css";

export default function ErrorPage() {
  return (
    <div className={s.wrapper}>
      <h1 className={s.title}>Something went wrong</h1>

      <a href="/" className={s.link}>
        Go Home
      </a>
    </div>
  );
}