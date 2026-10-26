import css from './Loader.module.css';

type Props = {
  text?: string;
};

const Loader = ({ text = 'Loading, please wait...' }: Props) => {
  return (
    <div className={css.wrapper} role="status" aria-live="polite">
      <span className={css.spinner} aria-hidden="true" />
      <p className={css.text}>{text}</p>
    </div>
  );
};

export default Loader;
