import styles from './page.module.css';

export const Home = async () => {
  return (
    <div className={styles['page']}>
      <main className={styles['main']}>
        <h1>Code Snippet Library</h1>
      </main>
    </div>
  );
};

export default Home;
