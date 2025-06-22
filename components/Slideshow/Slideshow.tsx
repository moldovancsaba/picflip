import styles from './Slideshow.module.css';

export const Slideshow: React.FC = () => {
  const slideshowUrl = 'https://api.togetherforvictory.com/backend/backend/slideshow?event-id=1779&slideshow-id=2202&date-from=1748728800000&enable-poster=0&token=eyJhbGciOiJIUzI1NiJ9.eyJzbGlkZXNob3dJZCI6MjIwMn0.iLS_ebzWrDt665-bUo2FhGN7dNGer2gSvUSfo7Uwfqc';

  return (
    <div className={styles.container}>
      <iframe
        src={slideshowUrl}
        className={styles.iframe}
        title="Slideshow"
      />
    </div>
  );
};
