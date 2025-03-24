import ProductList from '../../components/ProductList/ProductList';
import './home.css';
const Home = () => {
  return (
    <main>
      <h1>Home</h1>
      <p>Here are a few examples of Google Cloud Services and AI</p>
      <ol>
        <li>Cloud SQL integration 1</li>
        <ProductList />
      </ol>
    </main>
  );
};

export default Home;
